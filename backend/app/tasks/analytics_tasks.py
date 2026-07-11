import json
import random
from datetime import datetime
from typing import Optional
from sqlmodel import Session, select
from pydantic import BaseModel, Field

from .celery_app import celery_app
from ..settings import settings
from ..utilities.db import engine
from ..models.analytics import AnalyticsEvent, AnalyticsSession, ConversationAssessment
from ..models.conversation import Conversation, ChatMessage

# LangChain imports for AI assessment
try:
    from langchain_openai import ChatOpenAI
    from langchain_core.prompts import ChatPromptTemplate
    HAS_LANGCHAIN = True
except ImportError:
    HAS_LANGCHAIN = False


# --- User Agent Parsing Helper ---
def parse_user_agent(ua_string: str) -> tuple[str, str, str]:
    """Returns a tuple of (device, browser, os)."""
    if not ua_string:
        return "desktop", "unknown", "unknown"
    
    ua = ua_string.lower()
    
    # Classify device
    if "mobi" in ua or "iphone" in ua or "ipod" in ua:
        device = "mobile"
    elif "ipad" in ua or "tablet" in ua or "playbook" in ua:
        device = "tablet"
    else:
        device = "desktop"
        
    # Classify browser
    if "chrome" in ua or "crios" in ua:
        browser = "Chrome"
    elif "safari" in ua and "version" in ua:
        browser = "Safari"
    elif "firefox" in ua or "fxios" in ua:
        browser = "Firefox"
    elif "edge" in ua or "edg" in ua:
        browser = "Edge"
    elif "msie" in ua or "trident" in ua:
        browser = "IE"
    else:
        browser = "Other"
        
    # Classify OS
    if "windows" in ua:
        os = "Windows"
    elif "macintosh" in ua or "mac os x" in ua:
        os = "macOS"
    elif "iphone" in ua or "ipad" in ua or "ipod" in ua:
        os = "iOS"
    elif "android" in ua:
        os = "Android"
    elif "linux" in ua:
        os = "Linux"
    else:
        os = "Other"
        
    return device, browser, os


# --- Mock Geolocation Helper ---
MOCK_COUNTRIES = [
    ("United States", 0.50),
    ("United Kingdom", 0.15),
    ("Canada", 0.12),
    ("Germany", 0.08),
    ("France", 0.06),
    ("Australia", 0.05),
    ("India", 0.04)
]

def resolve_country(ip_address: str) -> str:
    if not ip_address or ip_address in ("127.0.0.1", "localhost", "::1"):
        r = random.random()
        cumulative = 0.0
        for country, weight in MOCK_COUNTRIES:
            cumulative += weight
            if r <= cumulative:
                return country
        return "United States"
    return "United States"


# --- Pydantic schema for LangChain Structured Output ---
class ConversationAnalysis(BaseModel):
    resolved: bool = Field(description="True if the visitor's problem/question was successfully resolved, False otherwise.")
    csat_score: float = Field(description="Calculated satisfaction rating on a scale of 1.0 to 5.0 based on visitor sentiment and language.")
    intent_accuracy: float = Field(description="Accuracy percentage (0.0 to 100.0) evaluating how well the bot understood the user's intent.")
    avg_confidence: float = Field(description="Confidence percentage (0.0 to 100.0) of the bot's responses.")
    response_quality: float = Field(description="Rating on a scale of 1.0 to 5.0 of the overall helpfulness and quality of the bot's responses.")
    multi_language: bool = Field(description="True if any language other than English was used in the conversation, False otherwise.")
    intent: str = Field(description="Classify the main intent of the user. Choose exactly one from: 'order_support', 'recommendations', 'faq', 'returns_refunds', 'other'.")


# --- Celery Ingestion Task ---
@celery_app.task(name="app.tasks.analytics_tasks.process_analytics_event_task")
def process_analytics_event_task(payload: dict, client_ip: str):
    store_id_raw = payload.get("store_id")
    session_id = payload.get("session_id")
    visitor_id = payload.get("visitor_id")
    event_type = payload.get("event_type")
    url = payload.get("url")
    referrer = payload.get("referrer")
    user_agent = payload.get("user_agent", "")
    event_data = payload.get("event_data")

    if not store_id_raw or not session_id or not visitor_id or not event_type:
        return {"status": "error", "message": "Missing required fields"}

    try:
        store_id = int(store_id_raw)
    except (ValueError, TypeError):
        return {"status": "error", "message": "Invalid store_id format"}

    device, browser, os = parse_user_agent(user_agent)
    country = resolve_country(client_ip)

    with Session(engine) as session:
        # Check if AnalyticsSession exists
        db_session = session.exec(
            select(AnalyticsSession).where(AnalyticsSession.session_id == session_id)
        ).first()
        now = datetime.utcnow()

        if not db_session:
            # Create a new session
            db_session = AnalyticsSession(
                session_id=session_id,
                store_id=store_id,
                visitor_id=visitor_id,
                started_at=now,
                last_activity_at=now,
                duration_seconds=0,
                pages_visited=1 if event_type == "pageview" else 0,
                device=device,
                browser=browser,
                os=os,
                country=country,
                referrer=referrer,
                landing_page=url
            )
            session.add(db_session)
        else:
            # Update existing session
            db_session.last_activity_at = now
            db_session.duration_seconds = int((now - db_session.started_at).total_seconds())
            if event_type == "pageview":
                db_session.pages_visited += 1
            session.add(db_session)

        # Create event log
        db_event = AnalyticsEvent(
            store_id=store_id,
            session_id=session_id,
            visitor_id=visitor_id,
            event_type=event_type,
            url=url,
            referrer=referrer,
            user_agent=user_agent,
            device=device,
            browser=browser,
            os=os,
            country=country,
            ip_address=client_ip,
            event_data=event_data,
            created_at=now
        )
        session.add(db_event)
        session.commit()

    return {"status": "success", "event_id": db_event.id}


# --- Celery AI Assessment Task ---
@celery_app.task(name="app.tasks.analytics_tasks.assess_conversation_task")
def assess_conversation_task(conversation_id: str | int, store_id: str | int):
    try:
        conversation_id_int = int(conversation_id)
        store_id_int = int(store_id)
    except (ValueError, TypeError):
        return {"status": "error", "message": f"Invalid conversation_id or store_id"}

    with Session(engine) as session:
        # 1. Fetch Conversation and messages
        conv = session.get(Conversation, conversation_id_int)
        if not conv:
            return {"status": "error", "message": f"Conversation {conversation_id_int} not found"}

        messages = session.exec(
            select(ChatMessage)
            .where(ChatMessage.conversation_id == conversation_id_int)
            .order_by(ChatMessage.created_at)
        ).all()

        if not messages:
            # No messages, insert default assessment
            assessment = ConversationAssessment(
                id=conversation_id_int,
                store_id=store_id,
                resolved=True if conv.status == "resolved" else False,
                csat_score=5.0 if conv.status == "resolved" else 4.0,
                intent_accuracy=100.0,
                avg_confidence=100.0,
                response_quality=5.0,
                multi_language=False,
                intent="faq",
                assessed_at=datetime.utcnow()
            )
            session.add(assessment)
            session.commit()
            return {"status": "success", "mode": "empty_fallback"}

        # Format transcript
        transcript_lines = []
        full_text = ""
        for m in messages:
            role_name = "Visitor" if m.sender == "visitor" else "AI Assistant"
            transcript_lines.append(f"{role_name}: {m.content}")
            full_text += f" {m.content}"
        
        transcript = "\n".join(transcript_lines)

        # 2. Check for OpenAI key to perform AI-based assessment
        if HAS_LANGCHAIN and settings.OPENAI_API_KEY:
            try:
                # Setup model
                kwargs = {
                    "model": settings.OPENAI_MODEL,
                    "api_key": settings.OPENAI_API_KEY,
                }
                if settings.OPENAI_BASE_URL:
                    kwargs["base_url"] = settings.OPENAI_BASE_URL
                
                llm = ChatOpenAI(**kwargs)
                structured_llm = llm.with_structured_output(ConversationAnalysis)

                # Prompt
                prompt_text = (
                    "You are an expert AI quality assurance analyzer for a customer support chatbot.\n"
                    "Analyze the following chat conversation transcript and evaluate the assistant's performance.\n\n"
                    "Transcript:\n"
                    "{transcript}\n\n"
                    "Return the structured evaluation metrics."
                )
                prompt = ChatPromptTemplate.from_template(prompt_text)
                chain = prompt | structured_llm

                analysis: ConversationAnalysis = chain.invoke({"transcript": transcript})

                assessment = ConversationAssessment(
                    id=conversation_id_int,
                    store_id=store_id,
                    resolved=analysis.resolved,
                    csat_score=analysis.csat_score,
                    intent_accuracy=analysis.intent_accuracy,
                    avg_confidence=analysis.avg_confidence,
                    response_quality=analysis.response_quality,
                    multi_language=analysis.multi_language,
                    intent=analysis.intent,
                    assessed_at=datetime.utcnow()
                )
                session.merge(assessment)
                session.commit()
                return {"status": "success", "mode": "ai", "intent": analysis.intent}
            except Exception as e:
                # Log error and trigger fallback
                print(f"[Celery AI Assessment] OpenAI check failed, running fallback: {e}")
        
        # 3. Fallback Heuristic Evaluator (Rule Engine)
        # CSAT: resolved gets higher csat
        csat = 4.8 if conv.status == "resolved" else 4.0
        # Check last messages for happy keywords
        visitor_messages = [m.content.lower() for m in messages if m.sender == "visitor"]
        last_visitor_msg = visitor_messages[-1] if visitor_messages else ""
        
        if any(w in last_visitor_msg for w in ["thank", "solved", "great", "perfect", "good", "yes"]):
            csat = 5.0
        elif any(w in last_visitor_msg for w in ["bad", "wrong", "error", "no", "fix", "help"]):
            csat = 3.0

        # Intent classification
        intent = "faq"
        full_text_lower = full_text.lower()
        if any(w in full_text_lower for w in ["order", "track", "ship", "delivery", "status"]):
            intent = "order_support"
        elif any(w in full_text_lower for w in ["return", "refund", "exchange", "cancel"]):
            intent = "returns_refunds"
        elif any(w in full_text_lower for w in ["recommend", "suggest", "look for", "like to buy", "buy"]):
            intent = "recommendations"
        
        # Multi language check
        multi_lang = False
        try:
            full_text.encode('ascii')
        except UnicodeEncodeError:
            multi_lang = True

        assessment = ConversationAssessment(
            id=conversation_id_int,
            store_id=store_id,
            resolved=True if conv.status == "resolved" else False,
            csat_score=csat,
            intent_accuracy=90.0,
            avg_confidence=88.0,
            response_quality=4.5,
            multi_language=multi_lang,
            intent=intent,
            assessed_at=datetime.utcnow()
        )
        session.merge(assessment)
        session.commit()

        return {"status": "success", "mode": "heuristic_fallback", "intent": intent}
