import { usePipecatClient } from '@pipecat-ai/client-react';
import { useChat } from '@/hooks/use-chat';
import { ChatBubble } from '@/components/chat-bubble';
import { ChatWindow } from '@/components/chat-window';
import { PreChatForm } from '@/components/pre-chat-form';
import type { WidgetConfig, Product, VoiceState } from '@/lib/types';
import type { VoiceErrorCode } from '@/lib/voice-error';
import { normalizeProduct } from '@/lib/types';
import { getOrCreateVisitorId } from '@/lib/api';
import { useEffect, useState, useCallback } from 'react';

interface LeafWidgetProps {
  config: WidgetConfig;
}

export function LeafWidget({ config }: LeafWidgetProps) {
  const normalizedProducts: Product[] | undefined = config.products?.map(normalizeProduct);
  const client = usePipecatClient();

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
  } = useChat(config, config.greeting || "Hello! I'm Leaf, your AI shopping assistant. How can I help you today?");

  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [agentText, setAgentText] = useState('');
  const [voiceProducts, setVoiceProducts] = useState<Product[]>([]);
  const [error, setError] = useState<{ code: VoiceErrorCode; message: string } | null>(null);

  useEffect(() => {
    if (!client) return;

    const handleConnected = () => setVoiceState('listening');
    const handleDisconnected = () => setVoiceState('idle');
    const handleBotStartedSpeaking = () => setVoiceState('speaking');
    const handleBotStoppedSpeaking = () => setVoiceState('listening');
    const handleUserStartedSpeaking = () => setVoiceState('listening');
    const handleUserStoppedSpeaking = () => setVoiceState('processing');
    const handleUserTranscript = (data: { text: string; final: boolean }) => {
      if (data.text) {
        if (data.final) {
          setTranscript(prev => prev + ' ' + data.text);
        } else {
          setTranscript(data.text);
        }
      }
    };
    const handleBotTranscript = (data: { text: string }) => {
      if (data.text) {
        setAgentText(data.text);
      }
    };
    const handleServerMessage = (data: unknown) => {
      if (!data || typeof data !== 'object') return;
      const msg = data as { type?: string; products?: unknown[] };
      if (msg.type === 'products' && Array.isArray(msg.products)) {
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
        setVoiceProducts(products);
      }
    };
    const handleError = (message: unknown) => {
      const msg = message as { message?: string };
      setError({ code: 'unknown' as VoiceErrorCode, message: msg?.message || 'Connection failed' });
      setVoiceState('error');
    };

    client.on('connected', handleConnected);
    client.on('disconnected', handleDisconnected);
    client.on('botStartedSpeaking', handleBotStartedSpeaking);
    client.on('botStoppedSpeaking', handleBotStoppedSpeaking);
    client.on('userStartedSpeaking', handleUserStartedSpeaking);
    client.on('userStoppedSpeaking', handleUserStoppedSpeaking);
    client.on('userTranscript', handleUserTranscript);
    client.on('botTranscript', handleBotTranscript);
    client.on('serverMessage', handleServerMessage);
    client.on('error', handleError);

    return () => {
      client.off('connected', handleConnected);
      client.off('disconnected', handleDisconnected);
      client.off('botStartedSpeaking', handleBotStartedSpeaking);
      client.off('botStoppedSpeaking', handleBotStoppedSpeaking);
      client.off('userStartedSpeaking', handleUserStartedSpeaking);
      client.off('userStoppedSpeaking', handleUserStoppedSpeaking);
      client.off('userTranscript', handleUserTranscript);
      client.off('botTranscript', handleBotTranscript);
      client.off('serverMessage', handleServerMessage);
      client.off('error', handleError);
    };
  }, [client]);

  const handleStartCall = useCallback(async (visitorName?: string, visitorEmail?: string, conversationId?: string) => {
    startCall();
    setTranscript('');
    setAgentText('');
    setVoiceProducts([]);
    setError(null);
    setVoiceState('connecting');

    try {
      const visitorId = getOrCreateVisitorId();
      await client.connect({
        webrtcRequestParams: {
          endpoint: `${config.apiUrl || 'http://localhost:8000'}/api/v1/voice/offer`,
          requestData: {
            storeId: config.storeId,
            visitorName: visitorName || visitorInfo?.name,
            visitorEmail: visitorEmail || visitorInfo?.email,
            visitorId,
            conversationId: conversationId || sessionId,
          },
        },
      });
    } catch (err) {
      setError({ code: 'unknown' as VoiceErrorCode, message: `Failed to start call: ${err}` });
      setVoiceState('error');
    }
  }, [client, config.apiUrl, config.storeId, visitorInfo, sessionId, startCall]);

  const handleEndCall = useCallback(async () => {
    endCall();
    await client.disconnect();
    setVoiceState('idle');
    setTranscript('');
    setAgentText('');
    setVoiceProducts([]);
    setError(null);
  }, [client, endCall]);

  const handleSubmitVisitorInfo = useCallback(
    async (data: { name: string; email: string }) => {
      const activeSessionId = await submitVisitorInfo(data, 'voice');
      await handleStartCall(data.name, data.email, activeSessionId);
    },
    [submitVisitorInfo, handleStartCall]
  );

  const displayProducts = voiceProducts.length > 0 ? voiceProducts : normalizedProducts;

  const showPreChatForm = isOpen && !visitorInfo;
  const showChat = isOpen && visitorInfo && !isCallActive;
  const showCall = isOpen && visitorInfo && isCallActive;

  return (
    <>
      {showPreChatForm && (
        <div
          className="fixed bottom-24 right-5 z-[999998] w-[380px] h-[450px] max-w-[calc(100vw-2.5rem)] max-h-[calc(100vh-8rem)] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden animate-leaf-slide-up"
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

      {showChat && (
        <ChatWindow
          isOpen={true}
          messages={messages}
          isTyping={isTyping}
          isCallActive={false}
          primaryColor={config.primaryColor || '#10b981'}
          position={config.position || 'bottom-right'}
          storeName={config.storeName || 'Leaf Assistant'}
          storeLogo={config.storeLogo}
          greeting={config.greeting || "Hello! I'm Leaf, your AI shopping assistant. How can I help you today?"}
          placeholder={config.placeholder || 'Type your message...'}
          showBranding={config.showBranding !== false}
          products={displayProducts}
          voiceState={voiceState}
          transcript={transcript}
          agentText={agentText}
          voiceError={error}
          onStartCall={handleStartCall}
          onEndCall={handleEndCall}
          onClose={close}
          onSend={sendMessage}
        />
      )}

      {showCall && (
        <ChatWindow
          isOpen={true}
          messages={messages}
          isTyping={isTyping}
          isCallActive={true}
          primaryColor={config.primaryColor || '#10b981'}
          position={config.position || 'bottom-right'}
          storeName={config.storeName || 'Leaf Assistant'}
          storeLogo={config.storeLogo}
          greeting={config.greeting || "Hello! I'm Leaf, your AI shopping assistant. How can I help you today?"}
          placeholder={config.placeholder || 'Type your message...'}
          showBranding={config.showBranding !== false}
          products={displayProducts}
          voiceState={voiceState}
          transcript={transcript}
          agentText={agentText}
          voiceError={error}
          onStartCall={handleStartCall}
          onEndCall={handleEndCall}
          onClose={close}
          onSend={sendMessage}
        />
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
