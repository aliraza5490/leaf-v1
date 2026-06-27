import re
from datetime import datetime

from loguru import logger
from pipecat.frames.frames import (
    Frame,
    FunctionCallResultFrame,
)
from pipecat.processors.frame_processor import FrameDirection, FrameProcessor
from pipecat.processors.frameworks.rtvi import RTVIServerMessageFrame
from pipecat.transports.smallwebrtc.connection import SmallWebRTCConnection
from sqlmodel import Session, select

from ..models.product import Product
from ..routes.product.service import first_image
from ..utilities.db import engine


def log_to_file(msg: str):
    try:
        with open("/home/ali/Documents/leaf-v1/backend/app/voice_bot/debug_processor.log", "a") as f:
            f.write(f"{datetime.utcnow().isoformat()} - {msg}\n")
    except Exception:
        pass


class ProductDataProcessor(FrameProcessor):
    def __init__(self, webrtc_connection: SmallWebRTCConnection):
        super().__init__()
        self._webrtc_connection = webrtc_connection
        self._last_products: list[dict] = []
        log_to_file("ProductDataProcessor initialized")

    async def process_frame(self, frame: Frame, direction: FrameDirection):
        await super().process_frame(frame, direction)

        if isinstance(frame, FunctionCallResultFrame):
            msg = f"received FunctionCallResultFrame: function_name='{frame.function_name}', result={repr(frame.result)}"
            logger.debug(f"[ProductDataProcessor] {msg}")
            log_to_file(msg)
            if frame.function_name in ("product_search_tool", "list_products_tool", "get_product_details_tool"):
                await self._extract_and_send_products(frame)
            else:
                logger.debug(f"[ProductDataProcessor] ignoring result for function '{frame.function_name}'")
                log_to_file(f"ignoring result for function '{frame.function_name}'")

        await self.push_frame(frame, direction)

    async def _extract_and_send_products(self, frame: FunctionCallResultFrame):
        result = frame.result
        if not result or not isinstance(result, str):
            logger.debug(f"[ProductDataProcessor] result is empty or not a string: {type(result)}")
            log_to_file(f"result is empty or not a string: {type(result)}")
            return

        product_ids = set()
        for match in re.finditer(r"ID:\s*(\d+)", result):
            product_ids.add(int(match.group(1)))

        logger.debug(f"[ProductDataProcessor] extracted product IDs: {product_ids}")
        log_to_file(f"extracted product IDs: {product_ids} from result: {repr(result)}")

        if not product_ids:
            logger.debug("[ProductDataProcessor] no product IDs found in result")
            log_to_file("no product IDs found in result")
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
            log_to_file(f"DB queried. Found products: {[p.name for p in products]}")

        if self._last_products:
            logger.debug(f"[ProductDataProcessor] sending {len(self._last_products)} product(s) via data channel: {[p['name'] for p in self._last_products]}")
            log_to_file(f"sending products via data channel: {self._last_products}")
            try:
                frame = RTVIServerMessageFrame(
                    data={
                        "type": "products",
                        "products": self._last_products,
                    }
                )
                await self.push_frame(frame)
                logger.debug("[ProductDataProcessor] products sent successfully via RTVIServerMessageFrame")
                log_to_file("products sent successfully via RTVIServerMessageFrame")
            except Exception as e:
                logger.warning(f"Failed to send products via RTVIServerMessageFrame: {e}")
                log_to_file(f"Failed to send products: {e}")
        else:
            log_to_file("self._last_products was empty after DB query")

    def get_last_products(self) -> list[dict]:
        return self._last_products
