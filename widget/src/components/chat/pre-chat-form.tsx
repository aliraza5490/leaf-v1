import { useState, useRef, useEffect } from 'react';

export interface PreChatFormData {
  name: string;
  email: string;
}

interface PreChatFormProps {
  primaryColor: string;
  storeName: string;
  greeting: string;
  onSubmit: (data: PreChatFormData) => void;
}

export function PreChatForm({ primaryColor, storeName, greeting, onSubmit }: PreChatFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Please enter your name');
      return;
    }
    onSubmit({ name: trimmedName, email: email.trim() });
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-6 bg-white dark:bg-zinc-900">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4"
        style={{ backgroundColor: primaryColor }}
      >
        {storeName.charAt(0).toUpperCase()}
      </div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-1">{storeName}</h2>
      <p className="text-sm text-gray-500 dark:text-zinc-400 text-center mb-6 px-4">{greeting}</p>
 
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            ref={nameRef}
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            placeholder="Your name"
            className="w-full text-sm bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-400 rounded-lg px-3 py-2.5 outline-none border-none focus:ring-2"
            style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
            autoComplete="name"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1">
            Email <span className="text-gray-400 dark:text-zinc-500">(optional)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full text-sm bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-400 rounded-lg px-3 py-2.5 outline-none border-none focus:ring-2"
            style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
            autoComplete="email"
          />
        </div>
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
        <button
          type="submit"
          className="w-full text-sm font-medium text-white rounded-lg py-2.5 transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer"
          style={{ backgroundColor: primaryColor }}
        >
          Start Call
        </button>
      </form>
    </div>
  );
}
