import { useRef, type WheelEvent } from 'react';
import type { Product } from '@/lib/types';

interface CallViewProps {
  storeName: string;
  storeLogo?: string;
  primaryColor: string;
  products?: Product[];
  onEndCall: () => void;
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

export function CallView({ storeName, storeLogo, primaryColor, products, onEndCall }: CallViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const highlightedId = products && products.length > 0 ? products[0].id : null;

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0) {
      e.preventDefault();
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += e.deltaY;
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full min-w-0 pt-10 pb-2 bg-gray-50 animate-leaf-fade-in">
      <div className="flex flex-col items-center mb-6">
        <div className="relative flex items-center justify-center mb-10">
          <div
            className="absolute w-28 h-28 rounded-full opacity-20 animate-leaf-glow-pulse"
            style={{ backgroundColor: primaryColor, animationDelay: '0s' }}
          />
          <div
            className="absolute w-24 h-24 rounded-full opacity-30 animate-leaf-glow-pulse"
            style={{ backgroundColor: primaryColor, animationDelay: '0.4s' }}
          />
          <div
            className="relative w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg animate-leaf-glow-breathe"
            style={{ backgroundColor: primaryColor }}
          >
            {storeLogo ? (
              <img src={storeLogo} alt="" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <MicIcon />
            )}
          </div>
        </div>

        <h3 className="text-base font-semibold text-gray-800 mb-0.5">{storeName}</h3>
        <p className="text-sm text-gray-500">Connected</p>
      </div>

      {products && products.length > 0 && (
        <div className="w-full mb-2 animate-leaf-slide-up">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-5">
            Recommended for you
          </p>
          <div
            ref={scrollRef}
            onWheel={handleWheel}
            style={{ width: '100%', overflowX: 'auto', scrollBehavior: 'smooth' }}
            className="scrollbar-hide"
          >
            <div style={{ display: 'flex', gap: '12px', width: 'max-content', paddingTop: '15px', paddingLeft: '20px', paddingRight: '20px', paddingBottom: '12px' }}>
              {products.map((product) => {
                const isHighlighted = highlightedId === product.id;
                return (
                  <a
                    key={product.id}
                    href={product.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline block relative flex-shrink-0 w-[130px]"
                  >
                    {isHighlighted && (
                      <div
                        className="absolute -inset-1 rounded-xl animate-leaf-product-pulse"
                        style={{ backgroundColor: primaryColor }}
                      />
                    )}
                    <div
                      className="relative rounded-lg border-2 bg-white transition-all"
                      style={{
                        borderColor: isHighlighted ? primaryColor : '#e5e7eb',
                        boxShadow: isHighlighted ? `0 0 0 3px ${primaryColor}33, 0 4px 12px ${primaryColor}22` : 'none',
                        transform: isHighlighted ? 'scale(1.03)' : 'scale(1)',
                      }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-24 object-cover rounded-t-md bg-gray-100"
                        loading="lazy"
                      />
                      <div className="p-2">
                        <p className="text-xs font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: primaryColor }}>
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center mt-auto mb-6">
        <button
          onClick={onEndCall}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-500 text-white font-medium text-sm hover:bg-red-600 active:scale-95 transition-all cursor-pointer shadow-lg shadow-red-500/25"
          aria-label="End call"
        >
          <PhoneIcon />
          End Call
        </button>
      </div>
    </div>
  );
}