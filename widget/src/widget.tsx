import { useChat } from '@/hooks/use-chat';
import { ChatBubble } from '@/components/chat-bubble';
import { ChatWindow } from '@/components/chat-window';
import type { WidgetConfig, Product } from '@/lib/types';
import { normalizeProduct } from '@/lib/types';

interface LeafWidgetProps {
  config: WidgetConfig;
}

export function LeafWidget({ config }: LeafWidgetProps) {
  const normalizedProducts: Product[] | undefined = config.products?.map(normalizeProduct);

  const {
    messages,
    isOpen,
    isTyping,
    isCallActive,
    toggle,
    close,
    startCall,
    endCall,
    sendMessage,
  } = useChat(config, config.greeting || "Hello! I'm Leaf, your AI shopping assistant. How can I help you today?");

  return (
    <>
      <ChatWindow
        isOpen={isOpen}
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
        products={normalizedProducts}
        onStartCall={startCall}
        onEndCall={endCall}
        onClose={close}
        onSend={sendMessage}
      />
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
