from langchain_core.tools import tool
from sqlmodel import Session
from ..routes.product.service import search_products, get_product as get_product_svc
from ..utilities.db import engine


@tool
def product_search(query: str, store_id: str = "") -> str:
    """Search for products by name, description, category, or tags.
    Returns a list of matching products with their details."""
    with Session(engine) as session:
        products = search_products(query, session, store_id if store_id else None, limit=5)
        if not products:
            return "No products found matching your query."
        results = []
        for p in products:
            results.append(
                f"ID: {p.id} | Name: {p.name} | Price: ${p.price:.2f} | "
                f"Description: {p.description} | Category: {p.category} | "
                f"Image: {p.image_url} | URL: {p.url}"
            )
        return "\n".join(results)


@tool
def get_product_details(product_id: int) -> str:
    """Get detailed information about a specific product by its ID."""
    with Session(engine) as session:
        try:
            product = get_product_svc(product_id, session)
            return (
                f"ID: {product.id} | Name: {product.name} | Price: ${product.price:.2f} | "
                f"Description: {product.description} | Category: {product.category} | "
                f"Tags: {product.tags} | Image: {product.image_url} | URL: {product.url}"
            )
        except Exception:
            return f"Product with ID {product_id} not found."


agent_tools = [product_search, get_product_details]
