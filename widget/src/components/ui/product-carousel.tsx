import { useRef, useEffect } from 'react';
import type { Product } from '@/lib/types';

interface ProductCarouselProps {
  products: Product[];
  primaryColor: string;
  highlightedProductId?: string | null;
  label?: string;
  className?: string;
  onAddToCart?: (product: Product) => void;
}

export function ProductCarousel({
  products,
  primaryColor,
  highlightedProductId,
  label,
  className = '',
  onAddToCart,
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
                  className={`relative rounded-xl border bg-white leaf-product-card-transition transition-all duration-300 ${isHighlighted ? 'border-transparent' : 'border-gray-100 hover:border-gray-200/80 hover:shadow-md hover:-translate-y-1'}`}
                  style={{
                    borderColor: isHighlighted ? primaryColor : undefined,
                    boxShadow: isHighlighted ? `0 0 0 3px ${primaryColor}22, 0 8px 20px ${primaryColor}15` : undefined,
                    transform: isHighlighted ? 'scale(1.02)' : undefined,
                  }}
                >
                  {isHighlighted && (
                    <div
                      className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center gap-1 py-0.5 rounded-t-xl text-white text-[9px] font-semibold uppercase tracking-wide animate-leaf-highlight-shimmer"
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
                    className="w-full h-24 object-cover rounded-t-xl bg-gray-100"
                    loading="lazy"
                  />
                  <div className="p-2">
                    <p className="text-[11px] font-semibold text-gray-900 truncate leading-tight">{product.name}</p>
                    
                    {/* Simulated Stars & Rating */}
                    <div className="flex items-center gap-0.5 mt-0.5 mb-1 text-amber-400">
                      <span className="text-[10px]">★★★★★</span>
                      <span className="text-[9px] text-gray-400 ml-1 font-medium">4.8</span>
                    </div>

                    {/* Price & sleek '+' action button */}
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs font-bold" style={{ color: primaryColor }}>
                        ${product.price.toFixed(2)}
                      </p>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (onAddToCart) {
                            onAddToCart(product);
                          }
                        }}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white bg-gray-900 hover:bg-gray-800 transition-all cursor-pointer active:scale-90"
                        style={{ backgroundColor: primaryColor }}
                        aria-label="Add to cart"
                      >
                        <span className="text-xs font-bold leading-none">+</span>
                      </button>
                    </div>
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
