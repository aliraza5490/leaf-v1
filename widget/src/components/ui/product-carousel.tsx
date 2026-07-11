import { useRef, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { tracker } from '@/lib/tracker';

interface ProductCarouselProps {
  products: Product[];
  primaryColor: string;
  highlightedProductId?: string | null;
  label?: string;
  className?: string;
}

export function ProductCarousel({
  products,
  primaryColor,
  highlightedProductId,
  label,
  className = '',
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLElement>>(new Map());

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

  // Auto-scroll to highlighted product
  useEffect(() => {
    if (!highlightedProductId || !scrollRef.current) return;
    const card = cardRefs.current.get(highlightedProductId);
    if (!card) return;

    const container = scrollRef.current;
    const cardLeft = card.offsetLeft;
    const cardWidth = card.offsetWidth;
    const containerWidth = container.clientWidth;
    const scrollLeft = container.scrollLeft;

    // If the card is not fully visible, scroll to center it
    if (cardLeft < scrollLeft || cardLeft + cardWidth > scrollLeft + containerWidth) {
      container.scrollTo({
        left: cardLeft - containerWidth / 2 + cardWidth / 2,
        behavior: 'smooth',
      });
    }
  }, [highlightedProductId]);

  if (products.length === 0) return null;

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
            const isHighlighted = highlightedProductId === product.id;
            return (
              <a
                key={product.id}
                href={product.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline block relative flex-shrink-0 w-[130px]"
                onClick={() => tracker.track('product_click', { productId: product.id, productName: product.name })}
                ref={(el) => {
                  if (el) cardRefs.current.set(product.id, el);
                  else cardRefs.current.delete(product.id);
                }}
              >

                {isHighlighted && (
                  <div
                    className="absolute -inset-1 rounded-xl animate-leaf-product-pulse"
                    style={{ backgroundColor: primaryColor }}
                  />
                )}
                <div
                  className={`relative rounded-lg border-2 bg-white leaf-product-card-transition ${isHighlighted ? '' : ''}`}
                  style={{
                    borderColor: isHighlighted ? primaryColor : '#e5e7eb',
                    boxShadow: isHighlighted ? `0 0 0 3px ${primaryColor}33, 0 4px 12px ${primaryColor}22` : 'none',
                    transform: isHighlighted ? 'scale(1.03)' : 'scale(1)',
                  }}
                >
                  {isHighlighted && (
                    <div
                      className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center gap-1 py-0.5 rounded-t-md text-white text-[9px] font-semibold uppercase tracking-wide animate-leaf-highlight-shimmer"
                      style={{
                        background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}cc, ${primaryColor})`,
                      }}
                    >
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6" /></svg>
                      Discussing
                    </div>
                  )}
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
