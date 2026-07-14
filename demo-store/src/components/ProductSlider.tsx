import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from './ProductCard';

interface ProductSliderProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductSlider: React.FC<ProductSliderProps> = ({
  products,
  onAddToCart,
  onSelectProduct,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 3;

  // Reset slider index if products change (due to category filter)
  useEffect(() => {
    setStartIndex(0);
  }, [products]);

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (startIndex + itemsPerPage < products.length) {
      setStartIndex((prev) => prev + 1);
    }
  };

  const visibleProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const canPrev = startIndex > 0;
  const canNext = startIndex + itemsPerPage < products.length;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8">
      {/* Section Title */}
      <div className="mb-10 flex items-center justify-between">
        <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          Our Newest products
        </h2>
        {products.length > itemsPerPage && (
          <div className="flex gap-2 text-sm text-slate-400 font-medium">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, products.length)} of {products.length}
          </div>
        )}
      </div>

      {/* Slider Container */}
      <div className="relative">
        {/* Left Arrow Button */}
        {canPrev && (
          <button
            onClick={handlePrev}
            className="absolute -left-5 top-[40%] z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg border border-slate-100 text-slate-700 transition-all duration-350 hover:bg-slate-50 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Previous Products"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Arrow Button */}
        {canNext && (
          <button
            onClick={handleNext}
            className="absolute -right-5 top-[40%] z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg border border-slate-100 text-slate-700 transition-all duration-350 hover:bg-slate-50 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Next Products"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Product Cards Row */}
        {products.length === 0 ? (
          <div className="flex h-64 w-full items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-slate-400 font-medium">
            No products found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 transition-all duration-500">
            {visibleProducts.map((product) => (
              <div
                key={product.id}
                className="transform transition-all duration-500 ease-in-out opacity-100 scale-100"
              >
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onSelect={onSelectProduct}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
