import { ChatHeader } from './chat-header';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';
import { CallView } from '@/components/voice/call-view';
import { CartView } from './cart-view';
import type { Message, Product, VoiceState } from '@/lib/types';
import type { VoiceErrorCode } from '@/lib/voice-error';

interface CartItem {
  product: Product;
  quantity: number;
}

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
  callDuration: number;
  onStartCall: () => void;
  onEndCall: () => void;
  onClose: () => void;
  onSend: (message: string) => void;
  cart: CartItem[];
  isCartOpen: boolean;
  onCartClick: () => void;
  onAddToCart: (product: Product) => void;
  onUpdateCartQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
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
  callDuration,
  onStartCall,
  onEndCall,
  onClose,
  onSend,
  cart,
  isCartOpen,
  onCartClick,
  onAddToCart,
  onUpdateCartQuantity,
  onRemoveFromCart,
  onClearCart,
}: ChatWindowProps) {
  if (!isOpen) return null;

  const posClass = position === 'bottom-right' ? 'right-5' : 'left-5';
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className={`fixed bottom-24 ${posClass} z-[999998] ${isCartOpen ? 'w-[380px] h-[550px]' : (isCallActive && products?.length ? 'w-[550px] h-[670px]' : 'w-[380px] h-[450px]')} max-w-[calc(100vw-2.5rem)] max-h-[calc(100vh-8rem)] bg-white dark:bg-zinc-900 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-leaf-slide-up`}
      style={{ fontFamily: 'var(--leaf-font, Inter, system-ui, sans-serif)' }}
    >
      <ChatHeader
        storeName={storeName}
        storeLogo={storeLogo}
        greeting={greeting}
        primaryColor={primaryColor}
        isCallActive={isCallActive}
        callDuration={callDuration}
        onStartCall={onStartCall}
        onEndCall={onEndCall}
        onClose={onClose}
        onCartClick={onCartClick}
        isCartOpen={isCartOpen}
        cartItemCount={cartItemCount}
      />
      {isCartOpen ? (
        <CartView
          cart={cart}
          primaryColor={primaryColor}
          onUpdateQuantity={onUpdateCartQuantity}
          onRemoveItem={onRemoveFromCart}
          onClearCart={onClearCart}
          onBackToChat={onCartClick}
        />
      ) : isCallActive ? (
        <CallView
          storeLogo={storeLogo}
          primaryColor={primaryColor}
          products={products}
          highlightedProductId={highlightedProductId}
          voiceState={voiceState}
          transcript={transcript}
          agentText={agentText}
          voiceError={voiceError}
          onEndCall={onEndCall}
          onAddToCart={onAddToCart}
        />
      ) : (
        <>
          <MessageList messages={messages} isTyping={isTyping} primaryColor={primaryColor} onAddToCart={onAddToCart} />
          <ChatInput onSend={onSend} placeholder={placeholder} primaryColor={primaryColor} disabled={isTyping} />
        </>
      )}
      {showBranding && (
        <div className={`text-center py-1.5 ${isCallActive ? 'bg-transparent text-gray-300' : 'bg-gray-50 dark:bg-zinc-900/80 border-t border-gray-100 dark:border-zinc-800'}`}>
          <span className={`text-[10px] ${isCallActive ? 'text-gray-400/50' : 'text-gray-400 dark:text-zinc-500'}`}>
            Powered by{' '}
            <span className={`font-semibold ${isCallActive ? 'text-gray-400/70' : 'text-gray-500 dark:text-zinc-400'}`}>Leaf</span>
          </span>
        </div>
      )}
    </div>
  );
}
