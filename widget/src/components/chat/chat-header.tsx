import { CloseIcon, PhoneIcon, AvatarIcon, CartIcon } from '@/components/ui/icons';

interface ChatHeaderProps {
  storeName: string;
  storeLogo?: string;
  greeting: string;
  primaryColor: string;
  isCallActive?: boolean;
  callDuration?: number;
  onStartCall?: () => void;
  onEndCall?: () => void;
  onClose: () => void;
  onCartClick?: () => void;
  isCartOpen?: boolean;
  cartItemCount?: number;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function ChatHeader({
  storeName,
  storeLogo,
  greeting,
  primaryColor,
  isCallActive,
  callDuration = 0,
  onStartCall,
  onEndCall,
  onClose,
  onCartClick,
  isCartOpen = false,
  cartItemCount = 0,
}: ChatHeaderProps) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 text-white rounded-t-xl"
      style={{ backgroundColor: primaryColor }}
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
        {storeLogo ? (
          <img src={storeLogo} alt="" className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <AvatarIcon size={20} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm leading-tight truncate">{storeName}</h3>
        <p className="text-xs text-white/80 truncate">
          {isCallActive ? `🟢 Connected • ${formatDuration(callDuration)}` : (isCartOpen ? "Reviewing Cart & Checkout" : (greeting.length > 50 ? greeting.slice(0, 50) + '...' : greeting))}
        </p>
      </div>
      {onCartClick && (
        <button
          onClick={onCartClick}
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer relative"
          aria-label="View Cart"
          style={isCartOpen ? { backgroundColor: 'rgba(255, 255, 255, 0.25)' } : undefined}
        >
          <CartIcon size={16} />
          {cartItemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-1 border border-white">
              {cartItemCount}
            </span>
          )}
        </button>
      )}
      {isCallActive ? (
        onEndCall && (
          <button
            onClick={onEndCall}
            className="flex-shrink-0 px-3 py-1.5 rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            aria-label="End call"
            title="End Call"
          >
            <PhoneIcon size={14} className="rotate-[135deg]" />
            <span>End Call</span>
          </button>
        )
      ) : (
        onStartCall && (
          <button
            onClick={onStartCall}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Start call"
            title="Start call"
          >
            <PhoneIcon size={16} />
          </button>
        )
      )}
      <button
        onClick={onClose}
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
        aria-label="Close chat"
      >
        <CloseIcon size={18} />
      </button>
    </div>
  );
}
