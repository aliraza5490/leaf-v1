from sqlmodel import Session

from pipecat.services.llm_service import FunctionCallParams

from ..routes.product.service import get_product, search_products
from ..utilities.db import engine


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
