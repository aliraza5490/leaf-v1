import { useState, useCallback, useRef } from 'react';
import type { ChatState, Message, WidgetConfig, Product } from '@/lib/types';
import { normalizeProduct } from '@/lib/types';
import { createConversation, sendMessage, getApiUrl } from '@/lib/api';

function createMessage(
  role: 'user' | 'assistant',
  content: string,
  products?: Product[],
): Message {
  return {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    role,
    content,
    products,
    timestamp: new Date(),
  };
}

export function useChat(config: WidgetConfig, greeting: string) {
  const [state, setState] = useState<ChatState>({
    messages: [createMessage('assistant', greeting)],
    isOpen: false,
    isTyping: false,
    isCallActive: true,
    sessionId: undefined,
  });

  const sessionRef = useRef<string | undefined>(undefined);
  const assistantMsgIdRef = useRef<string | null>(null);
  const apiUrl = getApiUrl(config.apiUrl);

  const open = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: true }));
  }, []);

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const toggle = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const startCall = useCallback(() => {
    setState((prev) => ({ ...prev, isCallActive: true }));
  }, []);

  const endCall = useCallback(() => {
    setState((prev) => ({ ...prev, isCallActive: false }));
  }, []);

  const sendMessage_ = useCallback(
    async (content: string) => {
      const userMsg = createMessage('user', content);

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMsg],
        isTyping: true,
      }));

      try {
        let sessionId = sessionRef.current;
        if (!sessionId) {
          sessionId = await createConversation(apiUrl, config.storeId);
          sessionRef.current = sessionId;
          setState((prev) => ({ ...prev, sessionId }));
        }

        const aiMsgId = `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        assistantMsgIdRef.current = aiMsgId;

        let fullContent = '';
        let products: Product[] | undefined;
        let assistantAdded = false;

        await sendMessage(apiUrl, sessionId, content, config.storeId, (event) => {
          if (event.type === 'token' && event.content) {
            fullContent += event.content;
            setState((prev) => {
              const msgs = [...prev.messages];
              if (!assistantAdded) {
                msgs.push(createMessage('assistant', fullContent));
                assistantAdded = true;
              } else {
                const lastMsg = msgs[msgs.length - 1];
                if (lastMsg && lastMsg.role === 'assistant') {
                  msgs[msgs.length - 1] = {
                    ...lastMsg,
                    content: fullContent,
                  };
                }
              }
              return { ...prev, messages: msgs, isTyping: false };
            });
          } else if (event.type === 'products' && event.products) {
            products = event.products.map(normalizeProduct);
          } else if (event.type === 'error') {
            setState((prev) => {
              const msgs = [...prev.messages];
              if (assistantAdded) {
                const lastMsg = msgs[msgs.length - 1];
                if (lastMsg && lastMsg.role === 'assistant' && !lastMsg.content) {
                  msgs[msgs.length - 1] = {
                    ...lastMsg,
                    content: 'Sorry, something went wrong. Please try again.',
                  };
                }
              } else {
                msgs.push(createMessage('assistant', 'Sorry, something went wrong. Please try again.'));
              }
              return { ...prev, messages: msgs, isTyping: false };
            });
          } else if (event.type === 'done') {
            setState((prev) => {
              const msgs = [...prev.messages];
              if (assistantAdded) {
                const lastMsg = msgs[msgs.length - 1];
                if (lastMsg && lastMsg.role === 'assistant') {
                  msgs[msgs.length - 1] = {
                    ...lastMsg,
                    content: fullContent || lastMsg.content || "I'm here to help! What can I do for you?",
                    products,
                  };
                }
              } else {
                msgs.push(createMessage('assistant', fullContent || "I'm here to help! What can I do for you?", products));
              }
              return { ...prev, messages: msgs, isTyping: false };
            });
            assistantMsgIdRef.current = null;
          }
        });
      } catch (err) {
        setState((prev) => {
          const msgs = [...prev.messages];
          const lastMsg = msgs[msgs.length - 1];
          if (lastMsg && lastMsg.role === 'assistant' && !lastMsg.content) {
            msgs[msgs.length - 1] = {
              ...lastMsg,
              content:
                "I'm having trouble connecting right now. Please try again in a moment.",
            };
          } else {
            msgs.push(createMessage('assistant', "I'm having trouble connecting right now. Please try again in a moment."));
          }
          return { ...prev, messages: msgs, isTyping: false };
        });
        assistantMsgIdRef.current = null;
      }
    },
    [apiUrl, config.storeId],
  );

  return {
    messages: state.messages,
    isOpen: state.isOpen,
    isTyping: state.isTyping,
    isCallActive: state.isCallActive,
    open,
    close,
    toggle,
    startCall,
    endCall,
    sendMessage: sendMessage_,
  };
}
