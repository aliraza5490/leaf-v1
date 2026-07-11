import json
from datetime import datetime
from sqlmodel import Session, select, func, text


from ..models.product import Product
from ..models.user import User
from ..models.store import Store
from ..models.conversation import Conversation, ChatMessage
from ..settings import settings
from ..utilities.auth import get_password_hash


SEED_STORE_ID = 1

SEED_PRODUCTS = [
    {
        "name": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
        "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday essentials in the main compartment.",
        "price": 109.95,
        "images": json.dumps(["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80"]),
        "url": "#",
        "category": "Men's clothing",
        "tags": "backpack,bag,laptop,men,fjallraven",
        "store_id": SEED_STORE_ID,
        "sku": "CLO-BPK-001",
        "stock": 25,
        "status": "active",
    },
    {
        "name": "Mens Casual Premium Slim Fit T-Shirts",
        "description": "Slim-fit style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.",
        "price": 22.30,
        "images": json.dumps(["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=80"]),
        "url": "#",
        "category": "Men's clothing",
        "tags": "tshirt,shirt,henley,slimfit,men",
        "store_id": SEED_STORE_ID,
        "sku": "CLO-SHT-002",
        "stock": 120,
        "status": "active",
    },
    {
        "name": "Mens Cotton Jacket",
        "description": "Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors.",
        "price": 55.99,
        "images": json.dumps(["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=80"]),
        "url": "#",
        "category": "Men's clothing",
        "tags": "jacket,outerwear,cotton,winter,men",
        "store_id": SEED_STORE_ID,
        "sku": "CLO-JKT-003",
        "stock": 45,
        "status": "active",
    },
    {
        "name": "Mens Casual Slim Fit",
        "description": "The color could be slightly different between on the screen and in practice. Please note that body builds vary by person, therefore, detailed size information should be reviewed.",
        "price": 15.99,
        "images": json.dumps(["https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&auto=format&fit=crop&q=80"]),
        "url": "#",
        "category": "Men's clothing",
        "tags": "shirt,tshirt,casual,slimfit,men",
        "store_id": SEED_STORE_ID,
        "sku": "CLO-TSH-004",
        "stock": 80,
        "status": "active",
    },
    {
        "name": "John Hardy Women's Legends Naga Gold & Silver Dragon Bracelet",
        "description": "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance.",
        "price": 695.00,
        "images": json.dumps(["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&auto=format&fit=crop&q=80"]),
        "url": "#",
        "category": "Jewelery",
        "tags": "bracelet,jewelry,dragon,silver,gold,women,john hardy",
        "store_id": SEED_STORE_ID,
        "sku": "JWL-BRC-005",
        "stock": 15,
        "status": "active",
    },
    {
        "name": "Solid Gold Petite Micropave",
        "description": "Satisfaction Guaranteed. Return or exchange any order within 30 days. Designed and handcrafted in the USA.",
        "price": 168.00,
        "images": json.dumps(["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&auto=format&fit=crop&q=80"]),
        "url": "#",
        "category": "Jewelery",
        "tags": "ring,gold,jewelry,petite,micropave",
        "store_id": SEED_STORE_ID,
        "sku": "JWL-RNG-006",
        "stock": 35,
        "status": "active",
    },
    {
        "name": "White Gold Plated Princess",
        "description": "Classic Created Wedding Engagement Ring for Women. Gift box included, ideal for Valentine's Day, Anniversary, Wedding, or Birthday.",
        "price": 9.99,
        "images": json.dumps(["https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500&auto=format&fit=crop&q=80"]),
        "url": "#",
        "category": "Jewelery",
        "tags": "ring,jewelry,white gold,princess,wedding",
        "store_id": SEED_STORE_ID,
        "sku": "JWL-RNG-007",
        "stock": 90,
        "status": "active",
    },
    {
        "name": "Pierced Owl Rose Gold Plated Stainless Steel Double",
        "description": "Rose Gold Plated Double Flared Tunnel Plug Ear Stretcher Piercing Jewelry. Available in multiple gauge sizes.",
        "price": 10.99,
        "images": json.dumps(["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80"]),
        "url": "#",
        "category": "Jewelery",
        "tags": "earring,piercing,rose gold,steel,double flare",
        "store_id": SEED_STORE_ID,
        "sku": "JWL-EAR-008",
        "stock": 65,
        "status": "active",
    },
    {
        "name": "WD 2TB Elements Portable External Hard Drive",
        "description": "USB 3.0 and USB 2.0 Compatibility, Fast data transfers, Improve PC Performance, High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7.",
        "price": 64.00,
        "images": json.dumps(["https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=500&auto=format&fit=crop&q=80"]),
        "url": "#",
        "category": "Electronics",
        "tags": "harddrive,wd,external,storage,2tb,usb",
        "store_id": SEED_STORE_ID,
        "sku": "ELC-HDD-009",
        "stock": 50,
        "status": "active",
    },
    {
        "name": "SanDisk SSD PLUS 1TB Internal SSD - SATA III",
        "description": "Easy upgrade for faster boot up, shutdown, application load and response. Boosts burst write performance, making it ideal for typical PC workloads.",
        "price": 109.00,
        "images": json.dumps(["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=80"]),
        "url": "#",
        "category": "Electronics",
        "tags": "ssd,sandisk,internal,storage,1tb,sata",
        "store_id": SEED_STORE_ID,
        "sku": "ELC-SSD-010",
        "stock": 30,
        "status": "active",
    },
    {
        "name": "BIYLACLESEN Women's 3-in-1 Snowboard Jacket",
        "description": "Note: The jacket is standard US size, please choose size as your usual wear. Material: 100% Polyester; Detachable fleece inner jacket.",
        "price": 56.99,
        "images": json.dumps(["https://images.unsplash.com/photo-1548883354-7622d03aca27?w=500&auto=format&fit=crop&q=80"]),
        "url": "#",
        "category": "Women's Clothing",
        "tags": "jacket,snowboard,winter,women,3in1",
        "store_id": SEED_STORE_ID,
        "sku": "CLO-WJK-011",
        "stock": 40,
        "status": "active",
    },
    {
        "name": "Lock and Love Women's Removable Hooded Jacket",
        "description": "100% POLYURETHANE (shell) 100% POLYESTER (lining). Faux leather material for style and comfort. Hand wash cold / Hang dry.",
        "price": 29.95,
        "images": json.dumps(["https://images.unsplash.com/photo-1508427953056-b00b8d78ef65?w=500&auto=format&fit=crop&q=80"]),
        "url": "#",
        "category": "Women's Clothing",
        "tags": "jacket,hooded,leather,faux,women",
        "store_id": SEED_STORE_ID,
        "sku": "CLO-WJK-012",
        "stock": 55,
        "status": "active",
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
    if not existing:
        store = Store(
            id=SEED_STORE_ID,
            name="Leaf Demo Store",
        )
        session.add(store)
        session.commit()

    # Synchronize the primary key sequence for the store table
    session.execute(
        text("SELECT setval(pg_get_serial_sequence('store', 'id'), COALESCE(max(id), 1)) FROM store;")
    )
    session.commit()
