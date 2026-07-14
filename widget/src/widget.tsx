import { useChat } from '@/hooks/use-chat';
import { ChatBubble } from '@/components/chat/chat-bubble';
import { ChatWindow } from '@/components/chat/chat-window';
import { PreChatForm } from '@/components/chat/pre-chat-form';
import type { WidgetConfig, Product, VoiceState } from '@/lib/types';
import type { VoiceErrorCode } from '@/lib/voice-error';
import { normalizeProduct } from '@/lib/types';
import { getOrCreateVisitorId } from '@/lib/api';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { PipecatClient } from '@pipecat-ai/client-js';
import { SmallWebRTCTransport } from '@pipecat-ai/small-webrtc-transport';
import { PipecatClientProvider, PipecatClientAudio } from '@pipecat-ai/client-react';

interface LeafWidgetProps {
  config: WidgetConfig;
}

function findMentionedProduct(text: string, products: Product[]): Product | null {
  if (!text || !products || products.length === 0) return null;

  const lowerText = text.toLowerCase();
  let bestProduct: Product | null = null;
  let maxIndex = -1;

  for (const product of products) {
    if (!product.name) continue;

    const nameLower = product.name.toLowerCase();
    
    // 1. Try matching the full product name first
    let idx = lowerText.lastIndexOf(nameLower);

    // 2. If not found, try matching the first two words
    if (idx === -1) {
      const words = nameLower.split(/\s+/).filter(w => w.length > 1);
      if (words.length >= 2) {
        const firstTwo = words.slice(0, 2).join(' ');
        idx = lowerText.lastIndexOf(firstTwo);
      } else if (words.length === 1) {
        idx = lowerText.lastIndexOf(words[0]);
      }
    }

    if (idx !== -1 && idx >= maxIndex) {
      if (idx === maxIndex && bestProduct && product.name.length <= bestProduct.name.length) {
        continue;
      }
      maxIndex = idx;
      bestProduct = product;
    }
  }

  return bestProduct;
}

function PipecatWrapper({ client, children }: { client: PipecatClient | null; children: React.ReactNode }) {
  if (!client) {
    return <>{children}</>;
  }
  return (
    <PipecatClientProvider client={client as any}>
      {children}
      <PipecatClientAudio />
    </PipecatClientProvider>
  );
}

interface CartItem {
  product: Product;
  quantity: number;
}

export function LeafWidget({ config }: LeafWidgetProps) {
  const normalizedProducts = useMemo(
    () => config.products?.map(normalizeProduct),
    [config.products]
  );
  const [client, setClient] = useState<PipecatClient | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('leaf_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('leaf_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('[Cart] Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Handle theme changes
  useEffect(() => {
    const container = document.getElementById('leaf-widget-container');
    if (!container) return;

    const theme = config.theme || 'light';

    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        container.classList.add('dark');
      } else {
        container.classList.remove('dark');
      }
    };

    if (theme === 'dark') {
      applyTheme(true);
    } else if (theme === 'light') {
      applyTheme(false);
    } else if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);

      const listener = (e: MediaQueryListEvent) => {
        applyTheme(e.matches);
      };

      mediaQuery.addEventListener('change', listener);
      return () => {
        mediaQuery.removeEventListener('change', listener);
      };
    }
  }, [config.theme]);

  const handleAddToCart = useCallback((product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const handleUpdateCartQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.product.id !== productId);
      }
      return prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
  }, []);

  const handleRemoveFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const handleClearCart = useCallback(() => {
    setCart([]);
  }, []);

  const handleCartClick = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  const {
    messages,
    isOpen,
    isTyping,
    isCallActive,
    sessionId,
    visitorInfo,
    toggle,
    close,
    startCall,
    endCall,
    submitVisitorInfo,
    sendMessage,
  } = useChat(
    config,
    config.greeting || "Hello! I'm Leaf, your AI shopping assistant. How can I help you today?",
    handleAddToCart,
    handleRemoveFromCart,
    handleUpdateCartQuantity
  );

  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [agentText, setAgentText] = useState('');
  const [voiceProducts, setVoiceProducts] = useState<Product[]>([]);
  const [highlightedProductId, setHighlightedProductId] = useState<string | null>(null);
  const [error, setError] = useState<{ code: VoiceErrorCode; message: string } | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive]);

  useEffect(() => {
    if (client) {
      (window as any).pipecatClient = client;
    }
    return () => {
      if (client) {
        client.disconnect().catch((err) => console.error('[Voice Widget] Error during cleanup disconnect:', err));
      }
    };
  }, [client]);

  const handleStartCall = useCallback(async (visitorName?: string, visitorEmail?: string, conversationId?: string) => {
    // If visitorName is a React/DOM event (from onClick), clear it to avoid cyclic object serialization issues.
    const actualName = (visitorName && typeof visitorName === 'string') ? visitorName : undefined;
    const actualEmail = (visitorEmail && typeof visitorEmail === 'string') ? visitorEmail : undefined;
    const actualConversationId = (conversationId && typeof conversationId === 'string') ? conversationId : undefined;

    startCall();
    setTranscript('');
    setAgentText('');
    setVoiceProducts([]);
    setHighlightedProductId(null);
    setError(null);
    setVoiceState('connecting');

    const transport = new SmallWebRTCTransport({
      webrtcRequestParams: {
        endpoint: `${config.apiUrl || 'http://localhost:8000'}/api/v1/voice/offer`,
      },
    });

    const newClient = new PipecatClient({
      transport,
      enableMic: true,
      enableCam: false,
    });

    // Register all event listeners immediately to prevent missing early events
    newClient.on('connected', () => setVoiceState('listening'));
    newClient.on('botStartedSpeaking', () => setVoiceState('speaking'));
    newClient.on('botStoppedSpeaking', () => setVoiceState('listening'));
    newClient.on('userStartedSpeaking', () => setVoiceState('listening'));
    newClient.on('userStoppedSpeaking', () => setVoiceState('processing'));
    newClient.on('userTranscript', (data: { text: string; final: boolean }) => {
      if (data.text) {
        if (data.final) {
          setTranscript(prev => prev + ' ' + data.text);
        } else {
          setTranscript(data.text);
        }
      }
    });
    newClient.on('botTranscript', (data: { text: string }) => {
      if (data.text) {
        setAgentText(data.text);
      }
    });
    newClient.on('serverMessage', (data: unknown) => {
      console.log("[Voice Widget] Received serverMessage:", data);
      if (!data || typeof data !== 'object') return;
      const msg = data as { type?: string; products?: unknown[]; productId?: unknown; product?: unknown; quantity?: number };
      if (msg.type === 'highlight_product' && msg.productId) {
        console.log("[Voice Widget] Highlighting product:", msg.productId);
        setHighlightedProductId(String(msg.productId));
      } else if (msg.type === 'add_to_cart' && msg.product) {
        console.log("[Voice Widget] Adding product to cart:", msg.product);
        const p = normalizeProduct(msg.product as any);
        const quantity = (msg.quantity as number) || 1;
        handleAddToCart(p, quantity);
      } else if (msg.type === 'remove_from_cart' && msg.productId) {
        console.log("[Voice Widget] Removing product from cart:", msg.productId);
        handleRemoveFromCart(String(msg.productId));
      } else if (msg.type === 'edit_cart_quantity' && msg.productId) {
        console.log("[Voice Widget] Editing cart quantity:", msg.productId, msg.quantity);
        handleUpdateCartQuantity(String(msg.productId), (msg.quantity as number) || 1);
      } else if (msg.type === 'products' && Array.isArray(msg.products)) {
        console.log("[Voice Widget] Parsing products:", msg.products);
        try {
          const products: Product[] = msg.products.map((p) => {
            const prod = p as Record<string, unknown>;
            return {
              id: String(prod.id),
              name: String(prod.name || ''),
              price: Number(prod.price || 0),
              image: String(prod.image || ''),
              url: prod.url ? String(prod.url) : undefined,
              description: prod.description ? String(prod.description) : undefined,
            };
          });
          console.log("[Voice Widget] Successfully set voice products:", products);
          setVoiceProducts(products);
          setHighlightedProductId(null);
        } catch (e) {
          console.error("[Voice Widget] Error parsing products payload:", e);
        }
      }
    });
    newClient.on('error', (message: unknown) => {
      const msg = message as { message?: string };
      setError({ code: 'unknown' as VoiceErrorCode, message: msg?.message || 'Connection failed' });
      setVoiceState('error');
    });

    setClient(newClient);

    try {
      const visitorId = getOrCreateVisitorId();
      await newClient.connect({
        webrtcRequestParams: {
          endpoint: `${config.apiUrl || 'http://localhost:8000'}/api/v1/voice/offer`,
          requestData: {
            storeId: config.storeId,
            visitorName: actualName || visitorInfo?.name,
            visitorEmail: actualEmail || visitorInfo?.email,
            visitorId,
            conversationId: actualConversationId || sessionId,
            greeting: config.greeting || "Hello! I'm Leaf, your AI shopping assistant. How can I help you today?",
          },
        },
      });
    } catch (err) {
      newClient.disconnect().catch((disErr) => console.error('[Voice Widget] Error during connect failure cleanup:', disErr));
      setError({ code: 'unknown' as VoiceErrorCode, message: `Failed to start call: ${err}` });
      setVoiceState('error');
      setClient(null);
    }
  }, [config.apiUrl, config.storeId, config.greeting, visitorInfo, sessionId, startCall]);

  const handleEndCall = useCallback(async () => {
    endCall();
    if (client) {
      // 1. Capture the underlying daily singleton before disconnecting/nullifying references
      const daily = (client as any)._transport?.mediaManager?._daily;

      // 2. Stop all local tracks explicitly
      try {
        const tracks = (client as any).tracks?.();
        if (tracks) {
          if (tracks.local) {
            if (tracks.local instanceof MediaStream) {
              tracks.local.getTracks().forEach((track: any) => track.stop());
            } else {
              if (tracks.local.audio) tracks.local.audio.stop();
              if (tracks.local.video) tracks.local.video.stop();
            }
          }
        }
      } catch (err) {
        console.error('[Voice Widget] Error stopping local tracks:', err);
      }

      // 3. Perform standard transport disconnect
      try {
        await client.disconnect();
      } catch (err) {
        console.error('[Voice Widget] Error during disconnect:', err);
      }

      // 4. Destroy the Daily call object singleton completely so that getCallInstance() starts fresh next time
      try {
        if (daily && typeof daily.destroy === 'function') {
          await daily.destroy();
        }
      } catch (err) {
        console.error('[Voice Widget] Error destroying daily call object:', err);
      }
    }
    setClient(null);
    setVoiceState('idle');
    setTranscript('');
    setAgentText('');
    setVoiceProducts([]);
    setHighlightedProductId(null);
    setError(null);
  }, [client, endCall]);

  useEffect(() => {
    if (!client) return;

    const handleDisconnected = () => {
      console.log('[Voice Widget] Client disconnected event received, cleaning up...');
      handleEndCall();
    };

    client.on('disconnected', handleDisconnected);
    return () => {
      client.off('disconnected', handleDisconnected);
    };
  }, [client, handleEndCall]);

  const handleSubmitVisitorInfo = useCallback(
    async (data: { name: string; email: string }) => {
      const activeSessionId = await submitVisitorInfo(data, 'voice');
      await handleStartCall(data.name, data.email, activeSessionId);
    },
    [submitVisitorInfo, handleStartCall]
  );

  const displayProducts = isCallActive ? voiceProducts : normalizedProducts;

  // Auto-highlight product mentioned in agent's spoken transcript
  useEffect(() => {
    if (agentText && displayProducts && displayProducts.length > 0) {
      const mentioned = findMentionedProduct(agentText, displayProducts);
      if (mentioned) {
        setHighlightedProductId(mentioned.id);
      }
    }
  }, [agentText, displayProducts]);

  const showPreChatForm = isOpen && !visitorInfo;
  const showChatWindow = isOpen && visitorInfo;
  const posClass = (config.position || 'bottom-right') === 'bottom-right' ? 'right-5' : 'left-5';

  return (
    <>
      {showPreChatForm && (
        <div
          className={`fixed bottom-24 ${posClass} z-[999998] w-[380px] h-[450px] max-w-[calc(100vw-2.5rem)] max-h-[calc(100vh-8rem)] bg-white dark:bg-zinc-900 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-leaf-slide-up`}
          style={{ fontFamily: 'var(--leaf-font, Inter, system-ui, sans-serif)' }}
        >
          <PreChatForm
            primaryColor={config.primaryColor || '#10b981'}
            storeName={config.storeName || 'Leaf Assistant'}
            greeting={config.greeting || "Hello! I'm Leaf, your AI shopping assistant. How can I help you today?"}
            onSubmit={handleSubmitVisitorInfo}
          />
        </div>
      )}

      {showChatWindow && (
        <PipecatWrapper client={client}>
          <ChatWindow
            isOpen={true}
            messages={messages}
            isTyping={isTyping}
            isCallActive={isCallActive}
            primaryColor={config.primaryColor || '#10b981'}
            position={config.position || 'bottom-right'}
            storeName={config.storeName || 'Leaf Assistant'}
            storeLogo={config.storeLogo}
            greeting={config.greeting || "Hello! I'm Leaf, your AI shopping assistant. How can I help you today?"}
            placeholder={config.placeholder || 'Type your message...'}
            showBranding={config.showBranding !== false}
            products={displayProducts}
            highlightedProductId={highlightedProductId}
            voiceState={voiceState}
            transcript={transcript}
            agentText={agentText}
            voiceError={error}
            callDuration={callDuration}
            cart={cart}
            isCartOpen={isCartOpen}
            onCartClick={handleCartClick}
            onAddToCart={handleAddToCart}
            onUpdateCartQuantity={handleUpdateCartQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onStartCall={handleStartCall}
            onEndCall={handleEndCall}
            onClose={close}
            onSend={sendMessage}
          />
        </PipecatWrapper>
      )}

      <ChatBubble
        onClick={toggle}
        isOpen={isOpen}
        primaryColor={config.primaryColor || '#10b981'}
        position={config.position || 'bottom-right'}
        storeLogo={config.storeLogo}
      />
    </>
  );
}
