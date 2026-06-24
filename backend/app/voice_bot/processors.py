import json
import re
from datetime import datetime

from loguru import logger
from pipecat.frames.frames import (
    Frame,
    FunctionCallResultFrame,
    LLMFullResponseEndFrame,
    TranscriptionFrame,
    TTSTextFrame,
)
from pipecat.processors.frame_processor import FrameDirection, FrameProcessor
from pipecat.transports.smallwebrtc.connection import SmallWebRTCConnection
from sqlmodel import Session, select

from ..models.conversation import ChatMessage, Conversation
from ..models.product import Product
from ..routes.product.service import first_image
from ..utilities.db import engine


class ProductDataProcessor(FrameProcessor):
    def __init__(self, webrtc_connection: SmallWebRTCConnection):
        super().__init__()
        self._webrtc_connection = webrtc_connection
        self._last_products: list[dict] = []

    async def process_frame(self, frame: Frame, direction: FrameDirection):
        await super().process_frame(frame, direction)

        if isinstance(frame, FunctionCallResultFrame):
            logger.debug(f"[ProductDataProcessor] received FunctionCallResultFrame: function_name='{frame.function_name}'")
            if frame.function_name == "product_search_tool":
                await self._extract_and_send_products(frame)
            else:
                logger.debug(f"[ProductDataProcessor] ignoring result for function '{frame.function_name}'")

        await self.push_frame(frame, direction)

    async def _extract_and_send_products(self, frame: FunctionCallResultFrame):
        result = frame.result
        if not result or not isinstance(result, str):
            logger.debug(f"[ProductDataProcessor] result is empty or not a string: {type(result)}")
            return

        product_ids = set()
        for match in re.finditer(r"ID:\s*(\d+)", result):
            product_ids.add(int(match.group(1)))

        logger.debug(f"[ProductDataProcessor] extracted product IDs: {product_ids}")

        if not product_ids:
            logger.debug("[ProductDataProcessor] no product IDs found in result")
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
                    "image": first_image(p.images),
                    "url": p.url,
                    "description": p.description,
                }
                for p in products
            ]

        if self._last_products:
            logger.debug(f"[ProductDataProcessor] sending {len(self._last_products)} product(s) via data channel: {[p['name'] for p in self._last_products]}")
            try:
                self._webrtc_connection.send_app_message(
                    {"type": "products", "products": self._last_products}
                )
                logger.debug("[ProductDataProcessor] products sent successfully")
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
