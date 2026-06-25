import asyncio
from collections import defaultdict
from typing import AsyncGenerator
import json


class ConversationStreamManager:
    """Manages SSE streams for live conversation updates."""

    def __init__(self):
        self._subscribers: dict[str, list[asyncio.Queue]] = defaultdict(list)

    async def subscribe(self, conversation_id: str) -> AsyncGenerator[str, None]:
        """Subscribe to updates for a conversation. Yields JSON-encoded events."""
        queue: asyncio.Queue = asyncio.Queue()
        self._subscribers[conversation_id].append(queue)
        try:
            while True:
                try:
                    event = await asyncio.wait_for(queue.get(), timeout=15.0)
                    yield event
                except asyncio.TimeoutError:
                    yield ": ping\n\n"
        finally:
            if conversation_id in self._subscribers:
                if queue in self._subscribers[conversation_id]:
                    self._subscribers[conversation_id].remove(queue)
                if not self._subscribers[conversation_id]:
                    del self._subscribers[conversation_id]

    def publish(self, conversation_id: str, event: dict):
        """Publish an event to all subscribers of a conversation."""
        if conversation_id not in self._subscribers:
            return
        event_str = f"data: {json.dumps(event)}\n\n"
        for queue in self._subscribers[conversation_id]:
            queue.put_nowait(event_str)


stream_manager = ConversationStreamManager()
