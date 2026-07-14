import type { Message, Product } from '@/lib/types';
import { MessageBubble } from './message-bubble';
import { TypingIndicator } from './typing-indicator';
import { useEffect, useRef } from 'react';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  primaryColor: string;
  onAddToCart?: (product: Product) => void;
}

export function MessageList({ messages, isTyping, primaryColor, onAddToCart }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} primaryColor={primaryColor} onAddToCart={onAddToCart} />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
