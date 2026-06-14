import type { Product, SSEEvent } from './types';

const DEFAULT_API_URL = 'http://localhost:8000';

export async function createConversation(
  apiUrl: string,
  storeId: string,
): Promise<string> {
  const response = await fetch(`${apiUrl}/api/v1/chat/conversations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ store_id: storeId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create conversation: ${response.statusText}`);
  }

  const data = await response.json();
  return data.id;
}

export async function sendMessage(
  apiUrl: string,
  sessionId: string,
  message: string,
  storeId: string,
  onEvent: (event: SSEEvent) => void,
): Promise<void> {
  const response = await fetch(`${apiUrl}/api/v1/chat/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
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
