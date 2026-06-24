import asyncio
from typing import List

from fastapi import APIRouter, BackgroundTasks, Request
from loguru import logger
from pydantic import BaseModel, Field
from typing import Any, List, Optional
from pipecat.transports.smallwebrtc.request_handler import (
    SmallWebRTCPatchRequest,
    SmallWebRTCRequestHandler,
    IceCandidate,
)
from sqlmodel import Session

from ..chat.service import create_conversation
from ...utilities.db import engine
from ...utilities.tags import Tags
from ...voice_bot import run_voice_bot

voice_router = APIRouter(prefix="/voice", tags=[Tags.chat])

small_webrtc_handler = SmallWebRTCRequestHandler()


class OfferRequestModel(BaseModel):
    sdp: str
    type: str
    pc_id: Optional[str] = None
    restart_pc: Optional[bool] = None
    request_data: Optional[Any] = Field(None, alias="requestData")

    class Config:
        populate_by_name = True


class IceCandidateModel(BaseModel):
    candidate: str
    sdp_mid: Optional[str] = Field(None, alias="sdpMid")
    sdp_mline_index: Optional[int] = Field(None, alias="sdpMLineIndex")

    class Config:
        populate_by_name = True


class PatchRequestModel(BaseModel):
    pc_id: str
    candidates: List[IceCandidateModel]


@voice_router.post("/offer")
async def voice_offer(
    request: OfferRequestModel,
    background_tasks: BackgroundTasks,
):
    logger.info(f"Received offer request: {request}")
    store_id = ""
    conversation_id = None

    if request.request_data:
        store_id = request.request_data.get("storeId", "")
        conversation_id = request.request_data.get("conversationId")

    if not conversation_id:
        with Session(engine) as session:
            conversation = create_conversation(store_id, session)
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
