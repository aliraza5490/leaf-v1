from sqlmodel import Session, select
from ..models.product import Product


SEED_PRODUCTS = [
    {
        "name": "Organic Green Tea",
        "description": "Premium Japanese sencha green tea, 100g loose leaf. Sourced from sustainable farms.",
        "price": 12.99,
        "image_url": "https://images.unsplash.com/photo-1556881286-fc6915169721?w=200&h=200&fit=crop",
        "url": "#",
        "category": "Beverages",
        "tags": "tea,organic,green tea,japanese",
        "store_id": "test_store",
    },
    {
        "name": "Bamboo Water Bottle",
        "description": "Eco-friendly insulated bottle with bamboo cap. Keeps drinks cold 24h, hot 12h.",
        "price": 24.99,
        "image_url": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&h=200&fit=crop",
        "url": "#",
        "category": "Accessories",
        "tags": "bottle,eco-friendly,bamboo,insulated",
        "store_id": "test_store",
    },
    {
        "name": "Cotton Tote Bag",
        "description": "Reusable organic cotton canvas tote. Perfect for shopping or everyday use.",
        "price": 18.50,
        "image_url": "https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&h=200&fit=crop",
        "url": "#",
        "category": "Accessories",
        "tags": "bag,tote,cotton,organic,reusable",
        "store_id": "test_store",
    },
    {
        "name": "Natural Soy Candle",
        "description": "Hand-poured lavender & vanilla soy wax candle. Burns for 40+ hours.",
        "price": 15.00,
        "image_url": "https://images.unsplash.com/photo-1602607688066-3d5c4e0e5e5a?w=200&h=200&fit=crop",
        "url": "#",
        "category": "Home",
        "tags": "candle,soy,lavender,vanilla,natural",
        "store_id": "test_store",
    },
]


def seed_products(session: Session):
    existing = session.exec(select(Product).where(Product.store_id == "test_store")).first()
    if existing:
        return

    for product_data in SEED_PRODUCTS:
        product = Product(**product_data)
        session.add(product)

    session.commit()
