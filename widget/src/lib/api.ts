import type { Product, SSEEvent } from './types';

const DEFAULT_API_URL = 'http://localhost:8000';
const VISITOR_ID_KEY = 'leaf_visitor_id';

let cachedVisitorId: string | null = null;

export function getOrCreateVisitorId(): string {
  if (cachedVisitorId) return cachedVisitorId;
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    cachedVisitorId = id;
    return id;
  } catch {
    cachedVisitorId = `v_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    return cachedVisitorId;
  }
}

export async function createConversation(
  apiUrl: string,
  storeId: number,
  visitorName?: string,
  visitorEmail?: string,
  visitorId?: string,
  channel: string = 'chat',
): Promise<string> {
  const response = await fetch(`${apiUrl}/api/v1/chat/conversations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      store_id: storeId,
      visitor_name: visitorName || undefined,
      visitor_email: visitorEmail || undefined,
      visitor_id: visitorId || undefined,
      channel,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create conversation: ${response.statusText}`);
  }

  const data = await response.json();
  return String(data.id);
}

export async function sendMessage(
  apiUrl: string,
  sessionId: string,
  message: string,
  storeId: number,
  onEvent: (event: SSEEvent) => void,
): Promise<void> {
  const response = await fetch(`${apiUrl}/api/v1/chat/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: String(sessionId),
      message,
      store_id: storeId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }

  if (!response.body) {
    throw new Error('No response body');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const dataStr = line.slice(6).trim();
        if (!dataStr) continue;

        try {
          const event: SSEEvent = JSON.parse(dataStr);
          onEvent(event);
        } catch {
          // skip malformed events
        }
      }
    }
  }
}

export async function getConversationHistory(
  apiUrl: string,
  sessionId: string,
): Promise<{ role: string; content: string; products?: Product[] }[]> {
  const response = await fetch(
    `${apiUrl}/api/v1/chat/conversations/${sessionId}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to get conversation: ${response.statusText}`);
  }

  const data = await response.json();
  return data.messages || [];
}

export function getApiUrl(configApiUrl?: string): string {
  return configApiUrl || DEFAULT_API_URL;
}

export function subscribeToAgentMessages(
  apiUrl: string,
  conversationId: string,
  onMessage: (message: { id: string; sender: string; content: string; products?: Product[] }) => void,
): () => void {
  const eventSource = new EventSource(
    `${apiUrl}/api/v1/chat/conversations/${conversationId}/stream`,
  );

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'agent_message' && data.message) {
        onMessage(data.message);
      }
    } catch {
      // skip malformed events
    }
  };

  return () => {
    eventSource.close();
  };
}
