import asyncio
import json
from datetime import datetime
from backend.models.schemas import SSEMessage

class StreamManager:
    """Manages Server-Sent Events (SSE) streams per session_id."""
    def __init__(self):
        # Maps session_id -> asyncio.Queue
        self.sessions = {}

    def _ensure_session(self, session_id: str):
        if session_id not in self.sessions:
            self.sessions[session_id] = asyncio.Queue()

    async def emit(self, session_id: str, msg_type: str, message: str):
        """Emit a structured message to a specific session."""
        self._ensure_session(session_id)
        msg = SSEMessage(type=msg_type, message=message, timestamp=datetime.utcnow())
        await self.sessions[session_id].put(msg)

    async def stream_generator(self, session_id: str):
        """Async generator that yields SSE formatted strings."""
        self._ensure_session(session_id)
        try:
            while True:
                msg = await self.sessions[session_id].get()
                # If we get an internal END message, break
                if msg.type == "END":
                    break
                
                # Yield in SSE format: data: {"type": ..., "message": ...}\n\n
                data = msg.model_dump_json()
                yield f"data: {data}\n\n"
        finally:
            # Cleanup when the stream is closed by client or ends
            if session_id in self.sessions:
                del self.sessions[session_id]

    async def close_stream(self, session_id: str):
        """Sends a signal to close the stream."""
        self._ensure_session(session_id)
        msg = SSEMessage(type="END", message="", timestamp=datetime.utcnow())
        await self.sessions[session_id].put(msg)

# Global singleton
stream_manager = StreamManager()
