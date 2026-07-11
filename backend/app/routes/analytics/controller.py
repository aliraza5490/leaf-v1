from fastapi import APIRouter, Depends, Request, status
from pydantic import BaseModel
from sqlmodel import Session
from typing import Optional

from ...utilities.db import get_session
from ...utilities.tags import Tags
from ...utilities.auth import get_user_from_token
from ...models.user import User
from .middleware import validate_analytics_request
from .service import (
    generate_csrf_token,
    get_analytics_kpi_summary,
    get_analytics_geography,
    get_analytics_visitor_activity,
    get_analytics_satisfaction_trends,
    get_analytics_intents,
    get_analytics_ai_performance
)
from ...tasks.analytics_tasks import process_analytics_event_task

analytics_router = APIRouter(prefix="/analytics", tags=[Tags.analytics])


class CSRFTokenRequest(BaseModel):
    store_id: int
    client_token: str
    session_id: str


class AnalyticsCollectRequest(BaseModel):
    store_id: int
    session_id: str
    visitor_id: str
    event_type: str
    url: Optional[str] = None
    referrer: Optional[str] = None
    user_agent: Optional[str] = None
    event_data: Optional[str] = None


@analytics_router.post("/token", summary="Generate a transient CSRF token for tracking")
def get_csrf_token(
    request: CSRFTokenRequest,
    session: Session = Depends(get_session)
):
    token = generate_csrf_token(
        store_id=request.store_id,
        client_token=request.client_token,
        session_id=request.session_id,
        session=session
    )
    return {"csrf_token": token}


@analytics_router.post(
    "/collect",
    status_code=status.HTTP_202_ACCEPTED,
    summary="Collect a client tracking event"
)
def collect_event(
    request: Request,
    body: AnalyticsCollectRequest,
    store = Depends(validate_analytics_request)
):
    # Retrieve host IP address
    client_ip = request.client.host if request.client else "127.0.0.1"

    # Enqueue task in Celery worker asynchronously
    process_analytics_event_task.delay(body.model_dump(), client_ip)
    
    return {"status": "accepted"}


@analytics_router.get("/kpis", summary="Get KPI Cards Summary")
def read_kpis(
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session)
):
    return get_analytics_kpi_summary(user.store_id, session)


@analytics_router.get("/geography", summary="Get geography stats")
def read_geography(
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session)
):
    return get_analytics_geography(user.store_id, session)


@analytics_router.get("/visitor-activity", summary="Get visitor activity timeline")
def read_visitor_activity(
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session)
):
    return get_analytics_visitor_activity(user.store_id, session)


@analytics_router.get("/satisfaction", summary="Get CSAT satisfaction trends")
def read_satisfaction(
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session)
):
    return get_analytics_satisfaction_trends(user.store_id, session)


@analytics_router.get("/intents", summary="Get intent breakdown distribution")
def read_intents(
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session)
):
    return get_analytics_intents(user.store_id, session)


@analytics_router.get("/ai-performance", summary="Get AI assistant performance radar scores")
def read_ai_performance(
    user: User = Depends(get_user_from_token),
    session: Session = Depends(get_session)
):
    return get_analytics_ai_performance(user.store_id, session)
