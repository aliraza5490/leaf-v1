import { useRef, useEffect } from 'react';
import type { Product } from '@/lib/types';

interface ProductCarouselProps {
  products: Product[];
  primaryColor: string;
  highlightFirst?: boolean;
  label?: string;
  className?: string;
}

export function ProductCarousel({
  products,
  primaryColor,
  highlightFirst = true,
  label,
  className = '',
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: globalThis.WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      } else if (e.deltaX !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaX;
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, []);

  if (products.length === 0) return null;

  const highlightedId = highlightFirst ? products[0].id : null;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-5">
          {label}
        </p>
      )}
      <div
        ref={scrollRef}
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
  );
}
