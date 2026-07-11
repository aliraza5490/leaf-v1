import asyncio
from typing import List

from fastapi import APIRouter, BackgroundTasks, Request, HTTPException
from loguru import logger
from pydantic import BaseModel, Field, ConfigDict
from typing import Any, List, Optional
from pipecat.transports.smallwebrtc.request_handler import (
    SmallWebRTCPatchRequest,
    SmallWebRTCRequestHandler,
    IceCandidate,
)
from sqlmodel import Session

from ..chat.service import create_conversation
from ...utilities.db import engine, verify_store_exists
from ...utilities.tags import Tags
from ...voice_bot import run_voice_bot

voice_router = APIRouter(prefix="/voice", tags=[Tags.chat])

small_webrtc_handler = SmallWebRTCRequestHandler()


class OfferRequestModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    sdp: str
    type: str
    pc_id: Optional[str] = None
    restart_pc: Optional[bool] = None
    request_data: Optional[Any] = Field(None, alias="requestData")


class IceCandidateModel(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    candidate: str
    sdp_mid: Optional[str] = Field(None, alias="sdpMid")
    sdp_mline_index: Optional[int] = Field(None, alias="sdpMLineIndex")


class PatchRequestModel(BaseModel):
    pc_id: Optional[str] = None
    candidates: List[IceCandidateModel]


@voice_router.post("/offer")
async def voice_offer(
    request: OfferRequestModel,
    background_tasks: BackgroundTasks,
):
    logger.info(f"Received offer request: {request}")
    store_id_raw = None
    visitor_name = None
    visitor_email = None
    visitor_id = None
    conversation_id = None

    if request.request_data:
        store_id_raw = request.request_data.get("storeId")
        conversation_id_raw = request.request_data.get("conversationId")
        if conversation_id_raw:
            try:
                conversation_id = int(conversation_id_raw)
            except (ValueError, TypeError):
                conversation_id = None
        visitor_name = request.request_data.get("visitorName")
        visitor_email = request.request_data.get("visitorEmail")
        visitor_id = request.request_data.get("visitorId")

    if not store_id_raw:
        raise HTTPException(status_code=400, detail="storeId is required")

    try:
        store_id = int(store_id_raw)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail="storeId must be an integer")

    with Session(engine) as session:
        verify_store_exists(store_id, session)
        if not conversation_id:
            conversation = create_conversation(
                store_id=store_id,
                session=session,
                visitor_name=visitor_name,
                visitor_email=visitor_email,
                visitor_id=visitor_id,
                channel="voice",
            )
            conversation_id = conversation.id

    async def webrtc_connection_callback(connection):
        background_tasks.add_task(run_voice_bot, connection, store_id, conversation_id)

    from pipecat.transports.smallwebrtc.request_handler import SmallWebRTCRequest
    pipecat_request = SmallWebRTCRequest(
        sdp=request.sdp,
        type=request.type,
        pc_id=request.pc_id,
        restart_pc=request.restart_pc,
        request_data=request.request_data,
    )

    answer = await small_webrtc_handler.handle_web_request(
        request=pipecat_request,
        webrtc_connection_callback=webrtc_connection_callback,
    )
    return answer


@voice_router.patch("/offer")
async def voice_ice_candidate(request: PatchRequestModel):
    logger.debug(f"Received ICE candidates: {request}")
    if not request.pc_id:
        logger.warning("Received ICE candidate patch request without pc_id")
        return {"status": "success"}

    
    valid_candidates = []
    for c in request.candidates:
        if not c.candidate:
            logger.debug("Skipping empty ICE candidate (end-of-candidates signal)")
            continue
        
        candidate_str = c.candidate.strip()
        if not candidate_str.startswith("candidate:"):
            logger.warning(f"Skipping malformed ICE candidate (no 'candidate:' prefix): {candidate_str}")
            continue
        
        parts = candidate_str.split()
        if len(parts) < 8:
            logger.warning(f"Skipping malformed ICE candidate (too few parts): {candidate_str}")
            continue
        
        valid_candidates.append(
            IceCandidate(
                candidate=candidate_str,
                sdp_mid=c.sdp_mid,
                sdp_mline_index=c.sdp_mline_index,
            )
        )
    
    if not valid_candidates:
        logger.debug("No valid ICE candidates to process")
        return {"status": "success"}

    patch_request = SmallWebRTCPatchRequest(
        pc_id=request.pc_id,
        candidates=valid_candidates,
    )

    try:
        await small_webrtc_handler.handle_patch_request(patch_request)
    except Exception as e:
        logger.error(f"Error processing ICE candidates: {e}")
        logger.debug(f"Candidates: {valid_candidates}")

    return {"status": "success"}


@voice_router.post("/webrtc-url")
async def get_webrtc_url(request: Request):
    base_url = str(request.base_url).rstrip("/")
    return {"webrtc_url": f"{base_url}{voice_router.prefix}/offer"}
