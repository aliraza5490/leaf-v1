import json
from datetime import datetime
from sqlmodel import Session, select, func


from ..models.product import Product
from ..models.user import User
from ..models.store import Store
from ..models.conversation import Conversation, ChatMessage
from ..settings import settings
from ..utilities.auth import get_password_hash


SEED_STORE_ID = 1

SEED_PRODUCTS = [
    {
        "name": "Organic Green Tea",
        "description": "Premium Japanese sencha green tea, 100g loose leaf. Sourced from sustainable farms.",
        "price": 12.99,
        "images": json.dumps(["https://images.unsplash.com/photo-1556881286-fc6915169721?w=200&h=200&fit=crop"]),
        "url": "#",
        "category": "Beverages",
        "tags": "tea,organic,green tea,japanese",
        "store_id": SEED_STORE_ID,
        "sku": "BEV-GTE-001",
        "stock": 120,
        "status": "active",
    },
    {
        "name": "Bamboo Water Bottle",
        "description": "Eco-friendly insulated bottle with bamboo cap. Keeps drinks cold 24h, hot 12h.",
        "price": 24.99,
        "images": json.dumps(["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&h=200&fit=crop"]),
        "url": "#",
        "category": "Accessories",
        "tags": "bottle,eco-friendly,bamboo,insulated",
        "store_id": SEED_STORE_ID,
        "sku": "ACC-BTL-002",
        "stock": 64,
        "status": "active",
    },
    {
        "name": "Cotton Tote Bag",
        "description": "Reusable organic cotton canvas tote. Perfect for shopping or everyday use.",
        "price": 18.50,
        "images": json.dumps(["https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&h=200&fit=crop"]),
        "url": "#",
        "category": "Accessories",
        "tags": "bag,tote,cotton,organic,reusable",
        "store_id": SEED_STORE_ID,
        "sku": "ACC-TOT-003",
        "stock": 8,
        "status": "active",
    },
    {
        "name": "Natural Soy Candle",
        "description": "Hand-poured lavender & vanilla soy wax candle. Burns for 40+ hours.",
        "price": 15.00,
        "images": json.dumps(["https://images.unsplash.com/photo-1620915789294-c972b1b1af7c?w=200&h=200&fit=crop"]),
        "url": "#",
        "category": "Home",
        "tags": "candle,soy,lavender,vanilla,natural",
        "store_id": SEED_STORE_ID,
        "sku": "HOM-CND-004",
        "stock": 0,
        "status": "draft",
    },
]


def seed_superuser(session: Session) -> None:
    existing = session.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()
    if existing:
        return

    superuser = User(
        email=settings.FIRST_SUPERUSER,
        hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
        full_name="Store Owner",
        store_id=SEED_STORE_ID,
        isActive=True,
        role="superadmin",
    )
    session.add(superuser)
    session.commit()


def seed_products(session: Session):
    existing = session.exec(
        select(Product).where(Product.store_id == SEED_STORE_ID)
    ).first()
    if existing:
        return

    for product_data in SEED_PRODUCTS:
        product = Product(**product_data)
        session.add(product)

    session.commit()


def seed_store(session: Session):
    existing = session.get(Store, SEED_STORE_ID)
    if existing:
        return

    store = Store(
        id=SEED_STORE_ID,
        name="Leaf Demo Store",
    )
    session.add(store)
    session.commit()
