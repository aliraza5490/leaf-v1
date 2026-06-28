import { ChatHeader } from './chat-header';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';
import { CallView } from '@/components/voice/call-view';
import type { Message, Product, VoiceState } from '@/lib/types';
import type { VoiceErrorCode } from '@/lib/voice-error';

interface ChatWindowProps {
  isOpen: boolean;
  messages: Message[];
  isTyping: boolean;
  isCallActive: boolean;
  primaryColor: string;
  position: 'bottom-right' | 'bottom-left';
  storeName: string;
  storeLogo?: string;
  greeting: string;
  placeholder: string;
  showBranding: boolean;
  products?: Product[];
  highlightedProductId?: string | null;
  voiceState: VoiceState;
  transcript: string;
  agentText: string;
  voiceError: { code: VoiceErrorCode; message: string } | null;
  onStartCall: () => void;
  onEndCall: () => void;
  onClose: () => void;
  onSend: (message: string) => void;
}

export function ChatWindow({
  isOpen,
  messages,
  isTyping,
  isCallActive,
  primaryColor,
  position,
  storeName,
  storeLogo,
  greeting,
  placeholder,
  showBranding,
  products,
  highlightedProductId,
  voiceState,
  transcript,
  agentText,
  voiceError,
  onStartCall,
  onEndCall,
  onClose,
  onSend,
}: ChatWindowProps) {
  if (!isOpen) return null;

  const posClass = position === 'bottom-right' ? 'right-5' : 'left-5';

  return (
    <div
      className={`fixed bottom-24 ${posClass} z-[999998] ${isCallActive && products?.length ? 'w-[550px] h-[670px]' : 'w-[380px] h-[450px]'} max-w-[calc(100vw-2.5rem)] max-h-[calc(100vh-8rem)] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden animate-leaf-slide-up`}
      style={{ fontFamily: 'var(--leaf-font, Inter, system-ui, sans-serif)' }}
    >
      <ChatHeader
        storeName={storeName}
        storeLogo={storeLogo}
        greeting={greeting}
        primaryColor={primaryColor}
        isCallActive={isCallActive}
        onStartCall={onStartCall}
        onClose={onClose}
      />
      {isCallActive ? (
        <CallView
          storeName={storeName}
          storeLogo={storeLogo}
          primaryColor={primaryColor}
          products={products}
          highlightedProductId={highlightedProductId}
          voiceState={voiceState}
          transcript={transcript}
          agentText={agentText}
          voiceError={voiceError}
          onEndCall={onEndCall}
        />
      ) : (
        <>
          <MessageList messages={messages} isTyping={isTyping} primaryColor={primaryColor} />
          <ChatInput onSend={onSend} placeholder={placeholder} primaryColor={primaryColor} disabled={isTyping} />
        </>
      )}
      {showBranding && (
        <div className="text-center py-1.5 bg-gray-50 border-t border-gray-100">
          <span className="text-[10px] text-gray-400">
            Powered by{' '}
            <span className="font-semibold text-gray-500">Leaf</span>
          </span>
        </div>
      )}
    </div>
  );
}
