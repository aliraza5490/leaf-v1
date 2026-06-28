import { ChatIcon, CloseIcon } from './icons';

interface ChatBubbleProps {
  onClick: () => void;
  isOpen: boolean;
  primaryColor: string;
  position: 'bottom-right' | 'bottom-left';
  storeLogo?: string;
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
        {isOpen ? <CloseIcon size={24} /> : storeLogo ? <img src={storeLogo} alt="" className="w-8 h-8 rounded-full object-cover" /> : <ChatIcon size={28} />}
      </span>
    </button>
  );
}
