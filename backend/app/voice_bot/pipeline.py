import asyncio
import wave
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

from loguru import logger
from pipecat.audio.vad.silero import SileroVADAnalyzer
from pipecat.frames.frames import LLMRunFrame, TTSSpeakFrame
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.worker import PipelineParams, PipelineWorker
from pipecat.processors.aggregators.llm_context import LLMContext
from pipecat.processors.aggregators.llm_response_universal import (
    AssistantTurnStoppedMessage,
    LLMContextAggregatorPair,
    LLMUserAggregatorParams,
    UserTurnStoppedMessage,
)
from pipecat.processors.audio.audio_buffer_processor import AudioBufferProcessor
from pipecat.processors.frameworks.rtvi import RTVIProcessor
from pipecat.services.cartesia.turns.stt import CartesiaTurnsSTTService
from pipecat.services.cartesia.tts import CartesiaTTSService
from pipecat.services.openai.llm import OpenAILLMService
from pipecat.services.google.llm import GoogleLLMService
from pipecat.transports.base_transport import TransportParams
from pipecat.transports.smallwebrtc.connection import SmallWebRTCConnection
from pipecat.transports.smallwebrtc.transport import SmallWebRTCTransport
from pipecat.workers.runner import WorkerRunner
from sqlmodel import Session, select

from ..models.conversation import ChatMessage, Conversation
from ..settings import settings
from ..utilities.db import engine
from .processors import ProductDataProcessor
from .prompts import SYSTEM_INSTRUCTION
from .tools import (
    end_conversation,
    get_product_details_tool,
    highlight_product,
    product_search_tool,
    list_products_tool,
    add_to_cart_tool,
    remove_from_cart_tool,
    edit_cart_quantity_tool,
)

RECORDINGS_DIR = Path(__file__).resolve().parent.parent.parent / "recordings"
SAMPLE_RATE = 24000
CHUNK_DURATION = 30


@dataclass
class AppResources:
    store_id: int
    conversation_id: int


async def run_voice_bot(
    webrtc_connection: SmallWebRTCConnection,
    store_id: int,
    conversation_id: int,
    greeting: str | None = None,
):
    logger.info(f"Starting voice bot for conversation {conversation_id}")

    transport = SmallWebRTCTransport(
        webrtc_connection=webrtc_connection,
        params=TransportParams(
            audio_in_enabled=True,
            audio_out_enabled=True,
        ),
    )

    stt = CartesiaTurnsSTTService(
        api_key=settings.CARTESIA_API_KEY,
    )
    tts = CartesiaTTSService(
        api_key=settings.CARTESIA_API_KEY,
        voice_id="db6b0ed5-d5d3-463d-ae85-518a07d3c2b4",
    )

    llm = GoogleLLMService(
        api_key=settings.GOOGLE_API_KEY,
        model=settings.GOOGLE_MODEL,
    )

    context = LLMContext(
        tools=[
            product_search_tool,
            get_product_details_tool,
            list_products_tool,
            highlight_product,
            end_conversation,
            add_to_cart_tool,
            remove_from_cart_tool,
            edit_cart_quantity_tool,
        ]
    )
    logger.debug(
        f"[pipeline] LLM context initialized with tools: {[t.__name__ for t in [product_search_tool, get_product_details_tool, list_products_tool, highlight_product, end_conversation, add_to_cart_tool, remove_from_cart_tool, edit_cart_quantity_tool]]}"
    )
    user_aggregator, assistant_aggregator = LLMContextAggregatorPair(
        context,
        user_params=LLMUserAggregatorParams(),
    )

    rtvi = RTVIProcessor()
    rtvi_observer = rtvi.create_rtvi_observer()

    product_processor = ProductDataProcessor(webrtc_connection)
    audiobuffer = AudioBufferProcessor(
        num_channels=1,
        sample_rate=SAMPLE_RATE,
        buffer_size=SAMPLE_RATE * 2 * CHUNK_DURATION,
    )

    recording_chunks: list[bytes] = []
    recording_sample_rate = SAMPLE_RATE
    recording_num_channels = 1

    pipeline = Pipeline(
        [
            transport.input(),
            rtvi,
            stt,
            user_aggregator,
            llm,
            tts,
            transport.output(),
            audiobuffer,
            product_processor,
            assistant_aggregator,
        ]
    )

    resources = AppResources(store_id=store_id, conversation_id=conversation_id)

    worker = PipelineWorker(
        pipeline,
        params=PipelineParams(
            enable_metrics=True,
            enable_usage_metrics=True,
        ),
        observers=[rtvi_observer],
        app_resources=resources,
    )

    @user_aggregator.event_handler("on_user_turn_stopped")
    async def on_user_turn_stopped(aggregator, strategy, message: UserTurnStoppedMessage):
        if not message.content or not message.content.strip():
            return
        logger.info(f"[transcript] user: {message.content}")
        try:
            with Session(engine) as session:
                msg = ChatMessage(
                    conversation_id=conversation_id,
                    role="user",
                    sender="visitor",
                    content=message.content.strip(),
                )
                session.add(msg)
                conv = session.exec(
                    select(Conversation).where(Conversation.id == conversation_id)
                ).first()
                if conv and conv.channel != "voice":
                    conv.channel = "voice"
                    session.add(conv)
                session.commit()
        except Exception as e:
            logger.error(f"Failed to save user transcript: {e}")

    @assistant_aggregator.event_handler("on_assistant_turn_stopped")
    async def on_assistant_turn_stopped(aggregator, message: AssistantTurnStoppedMessage):
        if not message.content or not message.content.strip():
            return
        logger.info(f"[transcript] assistant: {message.content}")
        try:
            with Session(engine) as session:
                msg = ChatMessage(
                    conversation_id=conversation_id,
                    role="assistant",
                    sender="ai",
                    content=message.content.strip(),
                )
                session.add(msg)
                conv = session.exec(
                    select(Conversation).where(Conversation.id == conversation_id)
                ).first()
                if conv:
                    conv.updated_at = datetime.utcnow()
                    if conv.channel != "voice":
                        conv.channel = "voice"
                    session.add(conv)
                session.commit()
        except Exception as e:
            logger.error(f"Failed to save assistant transcript: {e}")

    @transport.event_handler("on_client_connected")
    async def on_client_connected(transport, webrtc_conn):
        logger.info(f"Voice client connected: {conversation_id}")
        await audiobuffer.start_recording()
        await rtvi.set_bot_ready()
        
        # Add the main system instruction
        context.add_message(
            {"role": "developer", "content": SYSTEM_INSTRUCTION}
        )
        
        if greeting:
            logger.info(f"Speaking initial greeting for conversation {conversation_id}: {greeting}")
            context.add_message(
                {"role": "assistant", "content": greeting}
            )
            await worker.queue_frames([TTSSpeakFrame(greeting)])
        else:
            context.add_message(
                {"role": "developer", "content": "Start by concisely introducing yourself as Leaf, a shopping assistant."}
            )
            logger.debug(f"[pipeline] queuing LLMRunFrame for conversation {conversation_id}")
            await worker.queue_frames([LLMRunFrame()])

    @audiobuffer.event_handler("on_audio_data")
    async def on_audio_data(buffer, audio, sample_rate, num_channels):
        nonlocal recording_sample_rate, recording_num_channels
        if not audio:
            return
        recording_sample_rate = sample_rate
        recording_num_channels = num_channels
        recording_chunks.append(audio)
        logger.debug(f"[recording] accumulated chunk ({len(audio)} bytes), total chunks: {len(recording_chunks)}")

    @transport.event_handler("on_client_disconnected")
    async def on_client_disconnected(transport, webrtc_conn):
        logger.info(f"Voice client disconnected: {conversation_id}")
        await audiobuffer.stop_recording()
        await asyncio.sleep(1.0)

        if recording_chunks:
            RECORDINGS_DIR.mkdir(parents=True, exist_ok=True)
            filepath = RECORDINGS_DIR / f"{conversation_id}.wav"
            try:
                all_audio = b"".join(recording_chunks)
                with wave.open(str(filepath), "wb") as wf:
                    wf.setnchannels(recording_num_channels)
                    wf.setsampwidth(2)
                    wf.setframerate(recording_sample_rate)
                    wf.writeframes(all_audio)
                logger.info(f"Saved recording to {filepath} ({len(all_audio)} bytes)")
                audio_url = f"/recordings/{conversation_id}.wav"
                with Session(engine) as session:
                    conv = session.exec(
                        select(Conversation).where(Conversation.id == conversation_id)
                    ).first()
                    if conv:
                        conv.audio_recording_url = audio_url
                        session.add(conv)
                        session.commit()
                logger.info(f"Updated conversation {conversation_id} with audio_recording_url={audio_url}")
            except Exception as e:
                logger.error(f"Failed to save recording: {e}")
        else:
            logger.warning(f"No audio chunks recorded for conversation {conversation_id}")

        await worker.cancel()

    runner = WorkerRunner(handle_sigint=False)
    await runner.add_workers(worker)
    await runner.run()
