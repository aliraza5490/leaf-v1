import json
import secrets
import random
from datetime import datetime, timedelta
from sqlmodel import Session, select, func


from ..models.product import Product
from ..models.user import User
from ..models.store import Store
from ..models.analytics import AnalyticsEvent, AnalyticsSession, ConversationAssessment
from ..models.conversation import Conversation, ChatMessage
from ..settings import settings
from ..utilities.auth import get_password_hash


SEED_STORE_ID = 1
SEED_CLIENT_TOKEN = "test_client_token_123456"

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
        # Update token if it's blank
        if not existing.client_token:
            existing.client_token = SEED_CLIENT_TOKEN
            session.add(existing)
            session.commit()
        return

    store = Store(
        id=SEED_STORE_ID,
        name="Leaf Demo Store",
        client_token=SEED_CLIENT_TOKEN,
        allowed_origins="*"
    )
    session.add(store)
    session.commit()


def seed_historical_analytics(session: Session):
    # Check if analytics data already exists to avoid duplicate runs
    existing_events = session.exec(select(func.count(AnalyticsEvent.id)).where(AnalyticsEvent.store_id == SEED_STORE_ID)).one()
    if existing_events > 0:
        return

    print("[Seeder] Seeding historical analytics data for the last 30 days...")

    now = datetime.utcnow()
    countries = [
        ("United States", 0.50),
        ("United Kingdom", 0.15),
        ("Canada", 0.12),
        ("Germany", 0.08),
        ("France", 0.06),
        ("Australia", 0.05),
        ("India", 0.04)
    ]
    browsers = ["Chrome", "Safari", "Firefox", "Edge"]
    devices = ["desktop", "mobile", "tablet"]
    oss = ["Windows", "macOS", "iOS", "Android", "Linux"]
    
    intents = ["order_support", "recommendations", "faq", "returns_refunds"]
    visitor_names = ["John Doe", "Jane Smith", "Emma Watson", "Liam Neeson", "Olivia Wilde", 
                     "Noah Centineo", "Sophia Loren", "James Bond", "Charlotte Bronte", "Lucas Hedges"]

    # 1. Generate 50 sessions spread across the last 30 days
    for i in range(50):
        # Determine randomized past time
        days_ago = random.randint(0, 30)
        hour = random.randint(0, 23)
        minute = random.randint(0, 59)
        started_at = now - timedelta(days=days_ago, hours=hour, minutes=minute)
        
        session_id = f"mock_session_{i}_{secrets.token_hex(3)}"
        visitor_id = f"mock_visitor_{i}_{secrets.token_hex(3)}"
        
        # Pick country based on probability distribution
        r = random.random()
        cumulative = 0.0
        country = "United States"
        for c, w in countries:
            cumulative += w
            if r <= cumulative:
                country = c
                break
                
        device = random.choice(devices)
        browser = random.choice(browsers)
        os = "iOS" if device == "mobile" and random.random() > 0.5 else random.choice(oss)
        
        # Generate pageviews and events for this session
        pages = random.randint(1, 6)
        duration = random.randint(10, 600) # 10s to 10m
        last_activity = started_at + timedelta(seconds=duration)
        
        # Seed the session
        db_sess = AnalyticsSession(
            session_id=session_id,
            store_id=SEED_STORE_ID,
            visitor_id=visitor_id,
            started_at=started_at,
            last_activity_at=last_activity,
            duration_seconds=duration,
            pages_visited=pages,
            device=device,
            browser=browser,
            os=os,
            country=country,
            referrer="https://google.com" if random.random() > 0.3 else None,
            landing_page="https://my-store.com/home"
        )
        session.add(db_sess)
        
        # Add a Pageview event
        pv_event = AnalyticsEvent(
            store_id=SEED_STORE_ID,
            session_id=session_id,
            visitor_id=visitor_id,
            event_type="pageview",
            url="https://my-store.com/home",
            referrer="https://google.com",
            device=device,
            browser=browser,
            os=os,
            country=country,
            ip_address=f"192.168.1.{i}",
            created_at=started_at
        )
        session.add(pv_event)
        
        # Add random clicks & custom events
        click_count = random.randint(1, 5)
        for click_idx in range(click_count):
            click_time = started_at + timedelta(seconds=random.randint(5, duration - 5) if duration > 10 else 1)
            event_type = "click"
            event_data = None
            
            # 20% chance of product click
            if random.random() < 0.2:
                event_type = "product_click"
                event_data = json.dumps({"productId": "BEV-GTE-001", "productName": "Organic Green Tea"})
                
            click_event = AnalyticsEvent(
                store_id=SEED_STORE_ID,
                session_id=session_id,
                visitor_id=visitor_id,
                event_type=event_type,
                url="https://my-store.com/products/organic-green-tea" if event_type == "product_click" else "https://my-store.com/home",
                device=device,
                browser=browser,
                os=os,
                country=country,
                ip_address=f"192.168.1.{i}",
                event_data=event_data,
                created_at=click_time
            )
            session.add(click_event)

        # 2. For 40% of sessions, generate a chat conversation and post-session assessment
        if i % 2.5 == 0:
            # Create a mock resolved conversation
            v_name = random.choice(visitor_names)
            
            conv = Conversation(
                store_id=SEED_STORE_ID,
                channel="chat" if random.random() > 0.2 else "voice",
                status="resolved",
                visitor_name=v_name,
                visitor_email=f"{v_name.lower().replace(' ', '')}@example.com",
                visitor_id=visitor_id,
                source="Chat widget",
                pages_visited=pages,
                created_at=started_at,
                updated_at=last_activity
            )
            session.add(conv)
            session.flush() # Populate auto-incremented conv.id
            
            # Create message exchange
            msg1 = ChatMessage(
                conversation_id=conv.id,
                role="user",
                sender="visitor",
                content="Hello, I need some help with my order status.",
                created_at=started_at + timedelta(seconds=10)
            )
            session.add(msg1)
            
            msg2 = ChatMessage(
                conversation_id=conv.id,
                role="assistant",
                sender="agent",
                content="Sure! I can help you check your order status. What is your order number?",
                created_at=started_at + timedelta(seconds=30)
            )
            session.add(msg2)
            
            msg3 = ChatMessage(
                conversation_id=conv.id,
                role="user",
                sender="visitor",
                content="It is #12345. Thank you!",
                created_at=started_at + timedelta(seconds=50)
            )
            session.add(msg3)
            
            msg4 = ChatMessage(
                conversation_id=conv.id,
                role="assistant",
                sender="agent",
                content="I see order #12345 has been shipped and is scheduled to be delivered tomorrow. Is there anything else I can help you with?",
                created_at=started_at + timedelta(seconds=80)
            )
            session.add(msg4)
            
            # Commit conversation and messages so foreign key resolves correctly
            session.commit()

            # Generate assessment
            csat_scores = [4.0, 4.5, 5.0, 3.5, 4.8]
            csat = random.choice(csat_scores)
            selected_intent = random.choice(intents)
            
            assessment = ConversationAssessment(
                id=conv.id,
                store_id=SEED_STORE_ID,
                resolved=True,
                csat_score=csat,
                intent_accuracy=random.uniform(85.0, 100.0),
                avg_confidence=random.uniform(80.0, 95.0),
                response_quality=random.uniform(4.0, 5.0),
                multi_language=True if random.random() > 0.85 else False,
                intent=selected_intent,
                assessed_at=last_activity
            )
            session.add(assessment)
            session.commit()
            
    session.commit()

    print("[Seeder] Seeding historical analytics completed.")
