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
            elif frame.function_name == "add_to_cart_tool":
                await self._send_add_to_cart(frame)
            elif frame.function_name == "remove_from_cart_tool":
                await self._send_remove_from_cart(frame)
            elif frame.function_name == "edit_cart_quantity_tool":
                await self._send_edit_cart_quantity(frame)
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

    async def _send_add_to_cart(self, frame: FunctionCallResultFrame):
        result = frame.result
        if not result or not isinstance(result, str) or not result.startswith("ADD_TO_CART:"):
            logger.debug(f"[ProductDataProcessor] add to cart result malformed: {repr(result)}")
            return

        parts = result.split(":", 2)
        if len(parts) < 3:
            logger.debug(f"[ProductDataProcessor] add to cart result parts incomplete: {parts}")
            return
        
        product_id = parts[1]
        try:
            quantity = int(parts[2])
        except (ValueError, TypeError):
            quantity = 1

        logger.debug(f"[ProductDataProcessor] sending add to cart for product_id={product_id}, quantity={quantity}")
        try:
            product_id_int = int(product_id)
        except (ValueError, TypeError):
            logger.warning(f"Invalid product_id in add_to_cart_tool output: {product_id}")
            return

        with Session(engine) as session:
            p = session.get(Product, product_id_int)
            if not p:
                logger.warning(f"Product not found for ID: {product_id_int}")
                return
            product_data = {
                "id": str(p.id),
                "name": p.name,
                "price": p.price,
                "image": first_image(p.images),
                "url": p.url,
                "description": p.description,
            }

        try:
            add_frame = RTVIServerMessageFrame(
                data={
                    "type": "add_to_cart",
                    "product": product_data,
                    "quantity": quantity,
                }
            )
            await self.push_frame(add_frame)
            logger.debug("[ProductDataProcessor] add_to_cart sent successfully via RTVIServerMessageFrame")
        except Exception as e:
            logger.warning(f"Failed to send add_to_cart via RTVIServerMessageFrame: {e}")

    async def _send_remove_from_cart(self, frame: FunctionCallResultFrame):
        result = frame.result
        if not result or not isinstance(result, str) or not result.startswith("REMOVE_FROM_CART:"):
            logger.debug(f"[ProductDataProcessor] remove from cart result malformed: {repr(result)}")
            return
        product_id = result.split(":", 1)[1]
        logger.debug(f"[ProductDataProcessor] sending remove from cart for product_id={product_id}")
        try:
            remove_frame = RTVIServerMessageFrame(
                data={
                    "type": "remove_from_cart",
                    "productId": product_id,
                }
            )
            await self.push_frame(remove_frame)
            logger.debug("[ProductDataProcessor] remove_from_cart sent successfully")
        except Exception as e:
            logger.warning(f"Failed to send remove_from_cart via RTVIServerMessageFrame: {e}")

    async def _send_edit_cart_quantity(self, frame: FunctionCallResultFrame):
        result = frame.result
        if not result or not isinstance(result, str) or not result.startswith("EDIT_CART_QUANTITY:"):
            logger.debug(f"[ProductDataProcessor] edit cart quantity result malformed: {repr(result)}")
            return
        parts = result.split(":", 2)
        if len(parts) < 3:
            return
        product_id = parts[1]
        try:
            quantity = int(parts[2])
        except (ValueError, TypeError):
            quantity = 1
        logger.debug(f"[ProductDataProcessor] sending edit cart quantity for product_id={product_id}, quantity={quantity}")
        try:
            edit_frame = RTVIServerMessageFrame(
                data={
                    "type": "edit_cart_quantity",
                    "productId": product_id,
                    "quantity": quantity,
                }
            )
            await self.push_frame(edit_frame)
            logger.debug("[ProductDataProcessor] edit_cart_quantity sent successfully")
        except Exception as e:
            logger.warning(f"Failed to send edit_cart_quantity via RTVIServerMessageFrame: {e}")

    def get_last_products(self) -> list[dict]:
        return self._last_products
