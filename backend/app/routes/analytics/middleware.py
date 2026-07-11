from fastapi import Request, HTTPException, Depends
from sqlmodel import Session, select
from urllib.parse import urlparse

from ...utilities.db import get_session
from ...models.store import Store
from .redis_client import redis_client


async def validate_analytics_request(
    request: Request,
    db: Session = Depends(get_session)
) -> Store:
    csrf_token = request.headers.get("X-Leaf-CSRF-Token")
    session_id = request.headers.get("X-Leaf-Session-Id")
    store_id = request.headers.get("X-Leaf-Store-Id")

    if not csrf_token or not session_id or not store_id:
        raise HTTPException(
            status_code=400,
            detail="Missing security headers: X-Leaf-CSRF-Token, X-Leaf-Session-Id, or X-Leaf-Store-Id"
        )

    # 1. Validate CSRF token in Redis
    stored_token = redis_client.get(f"csrf:{session_id}")
    if not stored_token or stored_token != csrf_token:
        raise HTTPException(status_code=403, detail="Invalid or expired CSRF token")

    # 2. Fetch Store
    try:
        store_id_int = int(store_id)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail="Invalid store ID format")
    store = db.exec(select(Store).where(Store.id == store_id_int)).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    # 3. Validate Origin/Referer against store's allowed_origins list
    allowed_origins = store.allowed_origins or "*"
    if allowed_origins != "*":
        origins_list = [o.strip().lower() for o in allowed_origins.split(",") if o.strip()]
        
        origin = request.headers.get("origin")
        referer = request.headers.get("referer")
        
        req_host = None
        if origin:
            req_host = urlparse(origin).netloc.lower()
        elif referer:
            req_host = urlparse(referer).netloc.lower()
            
        if req_host:
            # Remove port if present (e.g. localhost:5173 -> localhost)
            if ":" in req_host:
                req_host = req_host.split(":")[0]
                
            # Perform host matching
            if req_host not in origins_list and "localhost" not in req_host:
                raise HTTPException(
                    status_code=403,
                    detail=f"Domain '{req_host}' is not authorized to report analytics for this store."
                )
                
    return store
