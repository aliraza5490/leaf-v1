from loguru import logger
from sqlmodel import Session, select

from pipecat.services.llm_service import FunctionCallParams

from ..models.product import Product
from ..routes.product.service import get_product, search_products, first_image
from ..utilities.db import engine


async def product_search_tool(
    params: FunctionCallParams, query: str
):
    """Search for products by name, description, category, or tags.
    Returns a list of matching products with their details.

    Args:
        query: The search query for finding products.
        store_id: Optional store ID to filter products.
    """
    store = params.app_resources.store_id
    logger.debug(f"[product_search_tool] called with query='{query}', store_id='{store}', resolved_store='{store}'")
    with Session(engine) as session:
        products = search_products(query, session, store if store else None, limit=5)
        logger.debug(f"[product_search_tool] found {len(products)} product(s)")
        if not products:
            result = "No products found matching your query."
            logger.debug(f"[product_search_tool] returning: {result}")
            await params.result_callback(result)
            return
        results = []
        for p in products:
            results.append(
                f"ID: {p.id} | Name: {p.name} | Price: ${p.price:.2f} | "
                f"Description: {p.description} | Category: {p.category} | "
                f"Image: {first_image(p.images)} | URL: {p.url}"
            )
        result = "\n".join(results)
        logger.debug(f"[product_search_tool] returning {len(results)} result(s):\n{result}")
        await params.result_callback(result)


async def get_product_details_tool(params: FunctionCallParams, product_id: int):
    """Get detailed information about a specific product by its ID.

    Args:
        product_id: The ID of the product to look up.
    """
    logger.debug(f"[get_product_details_tool] called with product_id={product_id}")
    with Session(engine) as session:
        try:
            product = get_product(product_id, session)
            result = (
                f"ID: {product.id} | Name: {product.name} | Price: ${product.price:.2f} | "
                f"Description: {product.description} | Category: {product.category} | "
                f"Tags: {product.tags} | Image: {first_image(product.images)} | URL: {product.url}"
            )
            logger.debug(f"[get_product_details_tool] found product: {result}")
            await params.result_callback(result)
        except Exception as e:
            result = f"Product with ID {product_id} not found."
            logger.debug(f"[get_product_details_tool] error: {e} -> returning: {result}")
            await params.result_callback(result)


async def list_products_tool(
    params: FunctionCallParams,
    query: str = "",
    store_id: str = "",
    limit: int = 10
):
    """List all available products in the store.
    Returns a list of products with their details.

    Args:
        query: Optional search/filter query.
        store_id: Optional store ID to filter products.
        limit: Maximum number of products to list.
    """
    store = store_id or params.app_resources.store_id
    logger.debug(f"[list_products_tool] called with store_id='{store}', query='{query}', limit={limit}")
    with Session(engine) as session:
        query_select = select(Product).where(Product.status == "active")
        if store:
            query_select = query_select.where(Product.store_id == store)
        products = session.exec(query_select.limit(limit)).all()
        logger.debug(f"[list_products_tool] found {len(products)} active product(s)")
        if not products:
            result = "No products are currently available in the store."
            logger.debug(f"[list_products_tool] returning: {result}")
            await params.result_callback(result)
            return
        results = []
        for p in products:
            results.append(
                f"ID: {p.id} | Name: {p.name} | Price: ${p.price:.2f} | "
                f"Description: {p.description} | Category: {p.category} | "
                f"Image: {first_image(p.images)} | URL: {p.url}"
            )
        result = "\n".join(results)
        logger.debug(f"[list_products_tool] returning {len(results)} result(s):\n{result}")
        await params.result_callback(result)


async def highlight_product(params: FunctionCallParams, product_id: int):
    """Highlight a specific product in the customer's UI.
    Call this BEFORE you start discussing a specific product so the customer
    can see which product you are talking about.

    Args:
        product_id: The ID of the product to highlight.
    """
    logger.debug(f"[highlight_product] called with product_id={product_id}")
    await params.result_callback(f"HIGHLIGHT:{product_id}")

