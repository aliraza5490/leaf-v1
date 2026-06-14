import { ChatHeader } from './chat-header';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';
import type { Message } from '@/lib/types';

interface ChatWindowProps {
  isOpen: boolean;
  messages: Message[];
  isTyping: boolean;
  primaryColor: string;
  position: 'bottom-right' | 'bottom-left';
  storeName: string;
  storeLogo?: string;
  greeting: string;
  placeholder: string;
  showBranding: boolean;
  onClose: () => void;
  onSend: (message: string) => void;
}

export function ChatWindow({
  isOpen,
  messages,
  isTyping,
  primaryColor,
  position,
  storeName,
  storeLogo,
  greeting,
  placeholder,
  showBranding,
  onClose,
  onSend,
}: ChatWindowProps) {
  if (!isOpen) return null;

  const posClass = position === 'bottom-right' ? 'right-5' : 'left-5';

  return (
    <div
      className={`fixed bottom-24 ${posClass} z-[999998] w-[380px] max-w-[calc(100vw-2.5rem)] h-[520px] max-h-[calc(100vh-8rem)] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden animate-leaf-slide-up`}
      style={{ fontFamily: 'var(--leaf-font, Inter, system-ui, sans-serif)' }}
    >
      <ChatHeader
        storeName={storeName}
        storeLogo={storeLogo}
        greeting={greeting}
        primaryColor={primaryColor}
        onClose={onClose}
      />
      <MessageList messages={messages} isTyping={isTyping} primaryColor={primaryColor} />
      <ChatInput onSend={onSend} placeholder={placeholder} primaryColor={primaryColor} disabled={isTyping} />
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
