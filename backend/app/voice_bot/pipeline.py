from dataclasses import dataclass

from loguru import logger
from pipecat.audio.vad.silero import SileroVADAnalyzer
from pipecat.frames.frames import LLMRunFrame
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.worker import PipelineParams, PipelineWorker
from pipecat.processors.aggregators.llm_context import LLMContext
from pipecat.processors.aggregators.llm_response_universal import (
    LLMContextAggregatorPair,
    LLMUserAggregatorParams,
)
from pipecat.services.cartesia.tts import CartesiaTTSService
from pipecat.services.cartesia.stt import CartesiaSTTService
from pipecat.services.deepgram.stt import DeepgramSTTService
from pipecat.services.groq.llm import GroqLLMService
from pipecat.transports.base_transport import TransportParams
from pipecat.transports.smallwebrtc.connection import SmallWebRTCConnection
from pipecat.transports.smallwebrtc.transport import SmallWebRTCTransport
from pipecat.workers.runner import WorkerRunner

from ..settings import settings
from .processors import ConversationPersistenceProcessor, ProductDataProcessor
from .prompts import SYSTEM_INSTRUCTION
from .tools import get_product_details_tool, product_search_tool


@dataclass
class AppResources:
    store_id: str
    conversation_id: str


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

    # stt = DeepgramSTTService(api_key=settings.DEEPGRAM_API_KEY)
    stt = CartesiaSTTService(api_key=settings.CARTESIA_API_KEY)
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
        reasoning_effort="low"
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
