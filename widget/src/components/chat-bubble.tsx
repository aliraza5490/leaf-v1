interface ChatBubbleProps {
  onClick: () => void;
  isOpen: boolean;
  primaryColor: string;
  position: 'bottom-right' | 'bottom-left';
  storeLogo?: string;
}

function ChatIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function ChatBubble({ onClick, isOpen, primaryColor, position, storeLogo }: ChatBubbleProps) {
  const posClass = position === 'bottom-right' ? 'right-5' : 'left-5';

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-5 ${posClass} z-[999999] w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-200 hover:scale-110 hover:shadow-xl active:scale-95 cursor-pointer`}
      style={{ backgroundColor: isOpen ? '#64748b' : primaryColor }}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      <span className="transition-transform duration-200" style={{ transform: isOpen ? 'rotate(0)' : 'rotate(0)' }}>
        {isOpen ? <CloseIcon /> : storeLogo ? <img src={storeLogo} alt="" className="w-8 h-8 rounded-full object-cover" /> : <ChatIcon />}
      </span>
    </button>
  );
}
