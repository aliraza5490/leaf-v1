import React, { useState } from 'react';

interface HeaderProps {
  cartCount: number;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  onAskAI: (query: string) => void;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  activeCategory,
  setActiveCategory,
  onAskAI,
  onOpenCart,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const navigationItems = [
    { id: 'all', label: 'Home' },
    { id: 'men', label: 'Men' },
    { id: 'women', label: 'Women' },
    { id: 'teens', label: 'Teens' },
    { id: 'electronics', label: 'Electronics' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onAskAI(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">

        {/* shopi Logo */}
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
          {/* Logo Icon */}
          <svg
            className="h-8 w-8 text-[#008060]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M19 6.5h-3v-1A2.5 2.5 0 0013.5 3h-3A2.5 2.5 0 008 5.5v1H5c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-11c0-1.1-.9-2-2-2zM9.5 5.5c0-.28.22-.5.5-.5h3c.28 0 .5.22.5.5v1h-4v-1zm9.5 13c0 .28-.22.5-.5.5H5.5c-.28 0-.5-.22-.5-.5v-10c0-.28.22-.5.5-.5h13c.28 0 .5.22.5.5v10z" />
            <path d="M12 9.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5zm0 4c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
          </svg>
          {/* Logo Text */}
          <span className="font-heading text-2xl font-extrabold tracking-tight">
            <span className="text-slate-900">Shop</span>
            <span className="text-[#008060]">i</span>
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center gap-8">
          {navigationItems.map((item) => {
            const isActive = activeCategory === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveCategory(item.id)}
                className={`relative py-2 text-sm font-semibold tracking-wide transition-colors duration-250 cursor-pointer ${isActive
                  ? 'text-slate-900'
                  : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-[#008060] transition-all duration-300" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">

          {/* Ask AI Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Ask AI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 lg:w-56 rounded-full border border-slate-200 bg-slate-50/50 py-2 pl-4 pr-10 text-sm outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-[#008060]/50 focus:bg-white focus:ring-2 focus:ring-[#008060]/10"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#008060] transition-colors cursor-pointer"
            >
              <svg
                className="h-4.5 w-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="group relative flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 active:scale-95 cursor-pointer"
          >
            <svg
              className="h-4.5 w-4.5 text-slate-500 group-hover:text-slate-800 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#008060] px-1 text-[10px] font-bold text-white transition-all scale-100 animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* User actions */}
          <button className="hidden lg:block text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">
            Sign In
          </button>

          <button className="rounded-full bg-[#008060] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-250 hover:bg-[#006e52] hover:shadow-md active:scale-97 cursor-pointer">
            Register
          </button>
        </div>
      </div>
    </header>
  );
};
