import React, { useState } from 'react';

export interface Product {
  id: number; // sequential int, no UUIDs as per workspace rule
  title: string;
  category: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onSelect,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group flex flex-col w-full text-left"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px] bg-[#eaeaec] p-4 flex items-center justify-center transition-all duration-500 hover:shadow-xl">
        <img
          src={product.image}
          alt={product.title}
          onClick={() => onSelect(product)}
          className="h-full w-full object-cover object-center rounded-[18px] transition-transform duration-700 ease-out group-hover:scale-105 cursor-pointer"
        />

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className={`absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-xs transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer ${
            isFavorite ? 'text-red-500' : 'text-slate-400 hover:text-red-500'
          }`}
        >
          <svg
            className="h-5.5 w-5.5"
            fill={isFavorite ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Quick Add to Cart Overlay */}
        <div
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-[85%] transition-all duration-300 ease-out ${
            isHovered
              ? 'translate-y-0 opacity-100'
              : 'translate-y-4 opacity-0 pointer-events-none'
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="w-full rounded-xl bg-slate-900/90 py-3 px-4 text-xs font-bold text-white shadow-lg backdrop-blur-xs transition-colors hover:bg-slate-950 active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            ADD TO CART
          </button>
        </div>
      </div>

      {/* Info container */}
      <div className="mt-4 flex items-start justify-between px-1">
        <div className="flex flex-col gap-0.5 max-w-[70%]">
          <h3
            onClick={() => onSelect(product)}
            className="font-sans text-[15px] font-semibold text-slate-800 tracking-tight leading-snug hover:text-[#008060] transition-colors cursor-pointer truncate"
          >
            {product.title}
          </h3>
          <span className="font-sans text-sm font-medium text-slate-400">
            {product.category}
          </span>
        </div>
        
        {/* Price */}
        <span className="font-sans text-[15px] font-semibold text-slate-800 tracking-tight shrink-0 mt-0.5">
          ₹{product.price}
        </span>
      </div>
    </div>
  );
};
