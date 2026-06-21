# Pipecat Integration Summary

## Overview
Successfully replaced the custom WebSocket-based voice implementation with Pipecat's React SDK and SmallWebRTC transport.

## Backend Changes

### 1. Dependencies (`backend/pyproject.toml`)
- **Removed**: `deepgram-sdk>=4.0`
- **Added**: `pipecat-ai[webrtc,deepgram,groq,cartesia,silero,runner]`

### 2. Settings (`backend/app/settings.py`)
- **Added**: `CARTESIA_API_KEY: str = ""`

### 3. New File: `backend/app/voice_bot.py`
Pipecat pipeline implementation:
- **Transport**: SmallWebRTCTransport with SileroVADAnalyzer for server-side VAD
- **STT**: DeepgramSTTService
- **LLM**: GroqLLMService with function calling support
- **TTS**: CartesiaTTSService
- **Tools**: 
  - `product_search_tool`: Search products by query
  - `get_product_details_tool`: Get product by ID
- **Custom Processors**:
  - `ProductDataProcessor`: Extracts product data from tool calls and sends via WebRTC data channel
  - `ConversationPersistenceProcessor`: Saves user/assistant messages to PostgreSQL

### 4. Rewritten: `backend/app/routes/voice/controller.py`
- **Removed**: WebSocket endpoint (`/voice/call`)
- **Added**: SmallWebRTC signaling endpoints:
  - `POST /api/v1/voice/offer`: SDP offer/answer exchange
  - `PATCH /api/v1/voice/offer`: ICE candidate exchange
- Uses Pydantic models for request validation
- Validates ICE candidates before processing

### 5. Deleted: `backend/app/routes/voice/service.py`
- Removed 336 lines of custom Deepgram SDK code
- Replaced by Pipecat pipeline in `voice_bot.py`

### 6. Environment Files
- **Updated**: `backend/.env` and `backend/.env.example`
  - Added `CARTESIA_API_KEY=` placeholder

## Widget Changes

### 1. Dependencies (`widget/package.json`)
- **Removed**: 
  - `@ricky0123/vad-web`
  - `onnxruntime-web`
- **Added**: 
  - `@pipecat-ai/client-js@^1.11.0`
  - `@pipecat-ai/client-react@^1.6.0`
  - `@pipecat-ai/small-webrtc-transport@^1.10.4`

### 2. Rewritten: `widget/src/loader.tsx`
- Creates `PipecatClient` with `SmallWebRTCTransport`
- Wraps widget with `PipecatClientProvider`
- Adds `PipecatClientAudio` component for audio playback

### 3. Rewritten: `widget/src/widget.tsx`
- Uses `usePipecatClient()` hook to access client
- Subscribes to RTVI events:
  - `connected`/`disconnected`: Connection state
  - `botStartedSpeaking`/`botStoppedSpeaking`: Bot speaking state
  - `userStartedSpeaking`/`userStoppedSpeaking`: User speaking state
  - `userTranscript`: User speech transcripts
  - `botTranscript`: Bot speech transcripts
  - `serverMessage`: Product data from backend
  - `error`: Error handling
- Calls `client.startBotAndConnect()` to initiate voice calls
- Calls `client.disconnect()` to end calls

### 4. Deleted Files
- `widget/src/lib/voice-call.ts` (312 lines): Manual VoiceCallManager class
- `widget/src/lib/tts-player.ts` (128 lines): Custom TTS playback
- `widget/src/hooks/use-voice-call.ts` (73 lines): Old voice hook
- `widget/public/mic-capture.worklet.js`: AudioWorklet for mic capture
- `widget/public/silero_vad.onnx`: Client-side VAD model
- `widget/public/vad.worklet.bundle.min.js`: VAD worklet
- `widget/public/ort-wasm-simd-threader.jsep.mjs`: ONNX Runtime WASM
- `widget/public/ort-wasm-simd-threader.jsep.wasm`: ONNX Runtime WASM binary

### 5. Updated: `widget/src/lib/types.ts`
- **Removed**: `VoiceWSMessage` and `ServerWSMessage` interfaces (no longer needed)
- **Kept**: `VoiceState` type (still used by UI)

### 6. Updated: `widget/vite.config.ts`
- **Removed**: `optimizeDeps.exclude: ['onnxruntime-web']` (no longer needed)

## Architecture Comparison

### Before (Custom WebSocket)
```
Widget                          Backend
  |                               |
  |-- WebSocket connect --------->| /api/v1/voice/call
  |-- start message ------------->|
  |                               |-- Create VoiceSession
  |                               |-- Open Deepgram STT WebSocket
  |<-- state: listening ----------|
  |                               |
  |== raw PCM audio bytes =======>|-- Forward to Deepgram STT
  |                               |
  |<-- transcript ----------------|-- Deepgram returns transcript
  |                               |
  |                               |-- Run LangChain agent
  |<-- agent_response ------------|
  |                               |
  |                               |-- Open Deepgram TTS WebSocket
  |<-- tts_audio (base64) --------|-- Stream TTS audio as JSON
  |                               |
  |-- TtsPlayer (Web Audio API) --|-- Play audio in browser
```

### After (Pipecat + WebRTC)
```
Widget                          Backend
  |                               |
  |-- POST /api/v1/voice/offer -->| Create SmallWebRTCConnection
  |<-- SDP answer ----------------|-- Start Pipecat pipeline
  |-- PATCH ICE candidates ------>|-- Add ICE candidates
  |                               |
  |<== WebRTC Audio =============>| Pipecat handles everything
  |<== WebRTC Data Channel ======>| Transcripts, products, state
```

## Key Improvements

1. **Server-side VAD**: Silero VAD runs on backend, no client-side ONNX Runtime needed
2. **Native WebRTC Audio**: No more base64 encoding/decoding, no custom TTS player
3. **Simplified Client**: Removed ~500 lines of custom voice code
4. **Better Architecture**: Pipecat handles STT→LLM→TTS pipeline automatically
5. **Product Data**: Sent via WebRTC data channel instead of custom WebSocket messages
6. **Conversation Persistence**: Handled by custom Pipecat processor

## Testing Checklist

- [ ] Start backend: `cd backend && uv run fastapi dev app/main.py`
- [ ] Start widget: `cd widget && npm run dev`
- [ ] Open test page: `http://localhost:5174/test.html`
- [ ] Click chat bubble to open widget
- [ ] Click phone icon to start voice call
- [ ] Speak into microphone - should see transcript
- [ ] Bot should respond with voice
- [ ] Ask about products - should see product cards during call
- [ ] Click "End Call" to disconnect

## Configuration Required

Add to `backend/.env`:
```
CARTESIA_API_KEY=your_cartesia_api_key_here
```

Get a Cartesia API key from: https://cartesia.ai/
