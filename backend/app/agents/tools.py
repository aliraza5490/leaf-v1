from langchain_core.tools import tool
from sqlmodel import Session
from ..routes.product.service import search_products, get_product as get_product_svc, first_image
from ..utilities.db import engine
import json

@tool
def product_search(query: str, store_id: str = "") -> str:
    """Search for products by name, description, category, or tags.
    Returns a list of matching products with their details."""
    with Session(engine) as session:
        store_id_val = None
        if store_id:
            try:
                store_id_val = int(store_id)
            except (ValueError, TypeError):
                pass
        products = search_products(query, session, store_id_val, limit=5)
        if not products:
            return "No products found matching your query."
        results = []
        for p in products:
            results.append(
                f"ID: {p.id} | Name: {p.name} | Price: ${p.price:.2f} | "
                f"Description: {p.description} | Category: {p.category} | "
                f"Image: {first_image(p.images)} | URL: {p.url}"
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
                f"Tags: {product.tags} | Image: {first_image(product.images)} | URL: {product.url}"
            )
        except Exception:
            return f"Product with ID {product_id} not found."


@tool
def add_to_cart(product_id: int, quantity: int = 1) -> str:
    """Add a product to the customer's shopping cart by its product ID.
    Always inform the customer that the product has been successfully added to their cart.
    """
    with Session(engine) as session:
        try:
            product = get_product_svc(product_id, session)
            product_data = {
                "id": str(product.id),
                "name": product.name,
                "price": product.price,
                "image": first_image(product.images),
                "url": product.url,
                "description": product.description
            }
            return json.dumps({
                "action": "add_to_cart",
                "product": product_data,
                "quantity": quantity
            })
        except Exception:
            return f"Product with ID {product_id} not found."


@tool
def remove_from_cart(product_id: int) -> str:
    """Remove a product from the customer's shopping cart by its product ID.
    Always inform the customer that the product has been successfully removed from their cart.
    """
    return json.dumps({
        "action": "remove_from_cart",
        "product_id": str(product_id)
    })


@tool
def edit_cart_quantity(product_id: int, quantity: int) -> str:
    """Edit or update the quantity of a product in the customer's shopping cart by its ID.
    Use this to change the quantity of an item (e.g. set quantity of product 3 to 5).
    If quantity is 0 or less, the product is removed from the cart.
    Always inform the customer that the quantity has been updated.
    """
    return json.dumps({
        "action": "edit_cart_quantity",
        "product_id": str(product_id),
        "quantity": quantity
    })


agent_tools = [product_search, get_product_details, add_to_cart, remove_from_cart, edit_cart_quantity]
