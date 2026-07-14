import { CloseIcon, PhoneIcon, AvatarIcon } from '@/components/ui/icons';

interface ChatHeaderProps {
  storeName: string;
  storeLogo?: string;
  greeting: string;
  primaryColor: string;
  isCallActive?: boolean;
  callDuration?: number;
  onStartCall?: () => void;
  onClose: () => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function ChatHeader({ storeName, storeLogo, greeting, primaryColor, isCallActive, callDuration = 0, onStartCall, onClose }: ChatHeaderProps) {
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
          {isCallActive ? `🟢 Connected • ${formatDuration(callDuration)}` : (greeting.length > 50 ? greeting.slice(0, 50) + '...' : greeting)}
        </p>
      </div>
      {!isCallActive && onStartCall && (
        <button
          onClick={onStartCall}
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
          aria-label="Start call"
        >
          <PhoneIcon size={16} />
        </button>
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
