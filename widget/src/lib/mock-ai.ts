import type { Message, Product } from './types';
import { mockResponses, fallbackResponses } from './mock-data';

export function getMockResponse(userMessage: string): { reply: string; products?: Product[] } {
  const lower = userMessage.toLowerCase();

  for (const response of mockResponses) {
    if (response.keywords.some((keyword) => lower.includes(keyword))) {
      return {
        reply: response.reply,
        products: response.products,
      };
    }
  }

  const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  return { reply: fallback };
}

export function createMessage(role: 'user' | 'assistant', content: string, products?: Product[]): Message {
  return {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    role,
    content,
    products,
    timestamp: new Date(),
  };
}

export function getTypingDelay(): number {
  return 600 + Math.random() * 1200;
}
