import { useState, useRef, useEffect } from 'react';
import { SendIcon } from '@/components/ui/icons';

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder: string;
  primaryColor: string;
  disabled?: boolean;
}

export function ChatInput({ onSend, placeholder, primaryColor, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-gray-200 bg-white">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 text-sm bg-gray-100 rounded-full px-4 py-2.5 outline-none border-none focus:ring-2 disabled:opacity-50"
        style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={!value.trim() || disabled}
        className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 cursor-pointer flex-shrink-0"
        style={{ backgroundColor: primaryColor }}
        aria-label="Send message"
      >
        <SendIcon />
      </button>
    </form>
  );
}
