import re

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


class ProductDataProcessor(FrameProcessor):
    def __init__(self, webrtc_connection: SmallWebRTCConnection):
        super().__init__()
        self._webrtc_connection = webrtc_connection
        self._last_products: list[dict] = []

    async def process_frame(self, frame: Frame, direction: FrameDirection):
        await super().process_frame(frame, direction)

        if isinstance(frame, FunctionCallResultFrame):
            msg = f"received FunctionCallResultFrame: function_name='{frame.function_name}', result={repr(frame.result)}"
            logger.debug(f"[ProductDataProcessor] {msg}")
            if frame.function_name in ("product_search_tool", "list_products_tool", "get_product_details_tool"):
                await self._extract_and_send_products(frame)
            elif frame.function_name == "highlight_product":
                await self._send_highlight(frame)
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
                frame = RTVIServerMessageFrame(
                    data={
                        "type": "products",
                        "products": self._last_products,
                    }
                )
                await self.push_frame(frame)
                logger.debug("[ProductDataProcessor] products sent successfully via RTVIServerMessageFrame")
            except Exception as e:
                logger.warning(f"Failed to send products via RTVIServerMessageFrame: {e}")

    async def _send_highlight(self, frame: FunctionCallResultFrame):
        result = frame.result
        if not result or not isinstance(result, str) or not result.startswith("HIGHLIGHT:"):
            logger.debug(f"[ProductDataProcessor] highlight result malformed: {repr(result)}")
            return

        product_id = result.split(":", 1)[1]
        logger.debug(f"[ProductDataProcessor] sending highlight for product_id={product_id}")
        try:
            highlight_frame = RTVIServerMessageFrame(
                data={
                    "type": "highlight_product",
                    "productId": product_id,
                }
            )
            await self.push_frame(highlight_frame)
            logger.debug("[ProductDataProcessor] highlight sent successfully")
        except Exception as e:
            logger.warning(f"Failed to send highlight via RTVIServerMessageFrame: {e}")

    def get_last_products(self) -> list[dict]:
        return self._last_products
