interface ChatHeaderProps {
  storeName: string;
  storeLogo?: string;
  greeting: string;
  primaryColor: string;
  onClose: () => void;
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function ChatHeader({ storeName, storeLogo, greeting, primaryColor, onClose }: ChatHeaderProps) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 text-white rounded-t-xl"
      style={{ backgroundColor: primaryColor }}
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
        {storeLogo ? (
          <img src={storeLogo} alt="" className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm leading-tight truncate">{storeName}</h3>
        <p className="text-xs text-white/80 truncate">{greeting.length > 50 ? greeting.slice(0, 50) + '...' : greeting}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
        aria-label="Close chat"
      >
        <CloseIcon />
      </button>
    </div>
  );
}
