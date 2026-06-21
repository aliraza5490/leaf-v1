import json
import re
from dataclasses import dataclass
from datetime import datetime

from loguru import logger
from pipecat.audio.vad.silero import SileroVADAnalyzer
from pipecat.frames.frames import (
    Frame,
    FunctionCallResultFrame,
    LLMFullResponseEndFrame,
    LLMRunFrame,
    OutputTransportMessageFrame,
    TranscriptionFrame,
    TTSTextFrame,
)
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.worker import PipelineParams, PipelineWorker
from pipecat.processors.aggregators.llm_context import LLMContext
from pipecat.processors.aggregators.llm_response_universal import (
    LLMContextAggregatorPair,
    LLMUserAggregatorParams,
)
from pipecat.processors.frame_processor import FrameDirection, FrameProcessor
from pipecat.services.cartesia.tts import CartesiaTTSService
from pipecat.services.deepgram.stt import DeepgramSTTService
from pipecat.services.groq.llm import GroqLLMService
from pipecat.services.llm_service import FunctionCallParams
from pipecat.transports.base_transport import TransportParams
from pipecat.transports.smallwebrtc.connection import SmallWebRTCConnection
from pipecat.transports.smallwebrtc.transport import SmallWebRTCTransport
from pipecat.workers.runner import WorkerRunner
from sqlmodel import Session, select

from .models.conversation import ChatMessage, Conversation
from .models.product import Product
from .routes.product.service import get_product, search_products
from .settings import settings
from .utilities.db import engine


@dataclass
class AppResources:
    store_id: str
    conversation_id: str


async def product_search_tool(
    params: FunctionCallParams, query: str, store_id: str = ""
):
    """Search for products by name, description, category, or tags.
    Returns a list of matching products with their details.

    Args:
        query: The search query for finding products.
        store_id: Optional store ID to filter products.
    """
    store = store_id or params.app_resources.store_id
    with Session(engine) as session:
        products = search_products(query, session, store if store else None, limit=5)
        if not products:
            await params.result_callback("No products found matching your query.")
            return
        results = []
        for p in products:
            results.append(
                f"ID: {p.id} | Name: {p.name} | Price: ${p.price:.2f} | "
                f"Description: {p.description} | Category: {p.category} | "
                f"Image: {p.image_url} | URL: {p.url}"
            )
        await params.result_callback("\n".join(results))


async def get_product_details_tool(params: FunctionCallParams, product_id: int):
    """Get detailed information about a specific product by its ID.

    Args:
        product_id: The ID of the product to look up.
    """
    with Session(engine) as session:
        try:
            product = get_product(product_id, session)
            await params.result_callback(
                f"ID: {product.id} | Name: {product.name} | Price: ${product.price:.2f} | "
                f"Description: {product.description} | Category: {product.category} | "
                f"Tags: {product.tags} | Image: {product.image_url} | URL: {product.url}"
            )
        except Exception:
            await params.result_callback(f"Product with ID {product_id} not found.")


class ProductDataProcessor(FrameProcessor):
    def __init__(self, webrtc_connection: SmallWebRTCConnection):
        super().__init__()
        self._webrtc_connection = webrtc_connection
        self._last_products: list[dict] = []

    async def process_frame(self, frame: Frame, direction: FrameDirection):
        await super().process_frame(frame, direction)

        if isinstance(frame, FunctionCallResultFrame):
            if frame.function_name == "product_search_tool":
                await self._extract_and_send_products(frame)

        await self.push_frame(frame, direction)

    async def _extract_and_send_products(self, frame: FunctionCallResultFrame):
        result = frame.result
        if not result or not isinstance(result, str):
            return

        product_ids = set()
        for match in re.finditer(r"ID:\s*(\d+)", result):
            product_ids.add(int(match.group(1)))

        if not product_ids:
            return

        with Session(engine) as session:
            products = session.exec(
                select(Product).where(Product.id.in_(list(product_ids)))
            ).all()
            self._last_products = [
                {
                    "id": p.id,
                    "name": p.name,
                    "price": p.price,
                    "image": p.image_url,
                    "url": p.url,
                    "description": p.description,
                }
                for p in products
            ]

        if self._last_products:
            try:
                self._webrtc_connection.send_app_message(
                    {"type": "products", "products": self._last_products}
                )
            except Exception as e:
                logger.warning(f"Failed to send products via data channel: {e}")

    def get_last_products(self) -> list[dict]:
        return self._last_products


class ConversationPersistenceProcessor(FrameProcessor):
    def __init__(self):
        super().__init__()
        self._user_transcript_buffer = ""
        self._assistant_transcript_buffer = ""

    async def process_frame(self, frame: Frame, direction: FrameDirection):
        await super().process_frame(frame, direction)

        if isinstance(frame, TranscriptionFrame):
            if frame.is_final:
                self._save_user_message(frame.text)
            else:
                self._user_transcript_buffer += frame.text + " "

        elif isinstance(frame, TTSTextFrame):
            self._assistant_transcript_buffer += frame.text + " "

        elif isinstance(frame, LLMFullResponseEndFrame):
            self._save_assistant_message()

        await self.push_frame(frame, direction)

    def _save_user_message(self, text: str):
        if not text.strip():
            return
        try:
            resources = self.pipeline_worker.app_resources
            with Session(engine) as session:
                msg = ChatMessage(
                    conversation_id=resources.conversation_id,
                    role="user",
                    content=text.strip(),
                )
                session.add(msg)
                session.commit()
        except Exception as e:
            logger.error(f"Failed to save user message: {e}")

    def _save_assistant_message(self, products: list[dict] | None = None):
        if not self._assistant_transcript_buffer.strip():
            return
        try:
            resources = self.pipeline_worker.app_resources
            with Session(engine) as session:
                msg = ChatMessage(
                    conversation_id=resources.conversation_id,
                    role="assistant",
                    content=self._assistant_transcript_buffer.strip(),
                    products_json=json.dumps(products) if products else "",
                )
                session.add(msg)

                conversation = session.exec(
                    select(Conversation).where(
                        Conversation.id == resources.conversation_id
                    )
                ).first()
                if conversation:
                    conversation.updated_at = datetime.utcnow()
                    session.add(conversation)

                session.commit()
            self._assistant_transcript_buffer = ""
        except Exception as e:
            logger.error(f"Failed to save assistant message: {e}")


SYSTEM_INSTRUCTION = """You are Leaf, a friendly and knowledgeable AI shopping assistant for e-commerce stores.

Your role:
- Help customers find products they're looking for
- Provide product recommendations based on their needs
- Answer questions about products, shipping, returns, and store policies
- Be warm, helpful, and concise in your responses

Guidelines:
- When a customer asks about products, use the product_search_tool to find relevant items
- Present products naturally in conversation, mentioning key details like name, price, and features
- If no products match, suggest alternative search terms or browse the catalog
- Keep responses concise but informative (2-4 sentences typically)
- Always be helpful and positive
- Your responses will be spoken aloud, so avoid emojis, bullet points, or other formatting that can't be spoken

When recommending products, format your response to naturally include the product details. The system will automatically extract product references from your response."""


async def run_voice_bot(
    webrtc_connection: SmallWebRTCConnection,
    store_id: str,
    conversation_id: str,
):
    logger.info(f"Starting voice bot for conversation {conversation_id}")

    transport = SmallWebRTCTransport(
        webrtc_connection=webrtc_connection,
        params=TransportParams(
            audio_in_enabled=True,
            audio_out_enabled=True,
            vad_analyzer=SileroVADAnalyzer(),
        ),
    )

    stt = DeepgramSTTService(api_key=settings.DEEPGRAM_API_KEY)

    tts = CartesiaTTSService(
        api_key=settings.CARTESIA_API_KEY,
        settings=CartesiaTTSService.Settings(
            voice="71a7ad14-091c-4e8e-a314-022ece01c121",
        ),
    )

    llm = GroqLLMService(
        api_key=settings.OPENAI_API_KEY,
        settings=GroqLLMService.Settings(
            model=settings.OPENAI_MODEL,
            system_instruction=SYSTEM_INSTRUCTION,
        ),
    )

    context = LLMContext(tools=[product_search_tool, get_product_details_tool])
    user_aggregator, assistant_aggregator = LLMContextAggregatorPair(
        context,
        user_params=LLMUserAggregatorParams(),
    )

    product_processor = ProductDataProcessor(webrtc_connection)
    persistence_processor = ConversationPersistenceProcessor()

    pipeline = Pipeline(
        [
            transport.input(),
            stt,
            user_aggregator,
            llm,
            tts,
            transport.output(),
            assistant_aggregator,
            product_processor,
            persistence_processor,
        ]
    )

    resources = AppResources(store_id=store_id, conversation_id=conversation_id)

    worker = PipelineWorker(
        pipeline,
        params=PipelineParams(
            enable_metrics=True,
            enable_usage_metrics=True,
        ),
        app_resources=resources,
    )

    @transport.event_handler("on_client_connected")
    async def on_client_connected(transport, webrtc_conn):
        logger.info(f"Voice client connected: {conversation_id}")
        context.add_message(
            {"role": "developer", "content": "Start by concisely introducing yourself as Leaf, a shopping assistant."}
        )
        await worker.queue_frames([LLMRunFrame()])

    @transport.event_handler("on_client_disconnected")
    async def on_client_disconnected(transport, webrtc_conn):
        logger.info(f"Voice client disconnected: {conversation_id}")
        await worker.cancel()

    runner = WorkerRunner(handle_sigint=False)
    await runner.add_workers(worker)
    await runner.run()
