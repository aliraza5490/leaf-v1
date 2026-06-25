import { useState, useCallback, useRef, useEffect } from 'react';
import type { ChatState, Message, WidgetConfig, Product } from '@/lib/types';
import { normalizeProduct } from '@/lib/types';
import { createConversation, sendMessage, getApiUrl, getOrCreateVisitorId, subscribeToAgentMessages } from '@/lib/api';
import type { PreChatFormData } from '@/components/pre-chat-form';

function createMessage(
  role: 'user' | 'assistant' | 'agent',
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
    isCallActive: false,
    sessionId: undefined,
    visitorInfo: undefined,
  });

  const sessionRef = useRef<string | undefined>(undefined);
  const assistantMsgIdRef = useRef<string | null>(null);
  const apiUrl = getApiUrl(config.apiUrl);
  const unsubscribeRef = useRef<(() => void) | null>(null);

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

  const submitVisitorInfo = useCallback(
    async (data: PreChatFormData) => {
      const visitorId = getOrCreateVisitorId();
      setState((prev) => ({ ...prev, visitorInfo: { name: data.name, email: data.email } }));

      try {
        const sessionId = await createConversation(
          apiUrl,
          config.storeId,
          data.name,
          data.email || undefined,
          visitorId,
          'chat',
        );
        sessionRef.current = sessionId;
        setState((prev) => ({ ...prev, sessionId }));

        unsubscribeRef.current?.();
        unsubscribeRef.current = subscribeToAgentMessages(apiUrl, sessionId, (msg) => {
          const products = msg.products?.map(normalizeProduct);
          setState((prev) => ({
            ...prev,
            messages: [...prev.messages, createMessage('agent', msg.content, products)],
          }));
        });
      } catch {
        // Conversation creation will be retried on first message
      }
    },
    [apiUrl, config.storeId],
  );

  useEffect(() => {
    return () => {
      unsubscribeRef.current?.();
    };
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
          const visitorId = getOrCreateVisitorId();
          const visitorInfo = state.visitorInfo;
          sessionId = await createConversation(
            apiUrl,
            config.storeId,
            visitorInfo?.name,
            visitorInfo?.email || undefined,
            visitorId,
            'chat',
          );
          sessionRef.current = sessionId;
          setState((prev) => ({ ...prev, sessionId }));

          unsubscribeRef.current?.();
          unsubscribeRef.current = subscribeToAgentMessages(apiUrl, sessionId, (msg) => {
            const products = msg.products?.map(normalizeProduct);
            setState((prev) => ({
              ...prev,
              messages: [...prev.messages, createMessage('agent', msg.content, products)],
            }));
          });
        }

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
      } catch {
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
    [apiUrl, config.storeId, state.visitorInfo],
  );

  return {
    messages: state.messages,
    isOpen: state.isOpen,
    isTyping: state.isTyping,
    isCallActive: state.isCallActive,
    sessionId: state.sessionId,
    visitorInfo: state.visitorInfo,
    open,
    close,
    toggle,
    startCall,
    endCall,
    submitVisitorInfo,
    sendMessage: sendMessage_,
  };
}
