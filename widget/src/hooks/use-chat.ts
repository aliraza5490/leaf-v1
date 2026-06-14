import { useState, useCallback, useRef } from 'react';
import type { ChatState } from '@/lib/types';
import { getMockResponse, createMessage, getTypingDelay } from '@/lib/mock-ai';

export function useChat(greeting: string) {
  const [state, setState] = useState<ChatState>({
    messages: [createMessage('assistant', greeting)],
    isOpen: false,
    isTyping: false,
  });

  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: true }));
  }, []);

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const toggle = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const sendMessage = useCallback((content: string) => {
    const userMsg = createMessage('user', content);

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMsg],
      isTyping: true,
    }));

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    typingTimerRef.current = setTimeout(() => {
      const { reply, products } = getMockResponse(content);
      const aiMsg = createMessage('assistant', reply, products);

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, aiMsg],
        isTyping: false,
      }));
    }, getTypingDelay());
  }, []);

  return {
    messages: state.messages,
    isOpen: state.isOpen,
    isTyping: state.isTyping,
    open,
    close,
    toggle,
    sendMessage,
  };
}
