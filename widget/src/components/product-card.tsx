import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <a
      href={product.url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 p-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors no-underline"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-14 h-14 rounded-md object-cover flex-shrink-0 bg-gray-100"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
        {product.description && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{product.description}</p>
        )}
        <p className="text-sm font-semibold mt-1" style={{ color: 'var(--leaf-primary, #10b981)' }}>
          ${product.price.toFixed(2)}
        </p>
      </div>
    </a>
  );
}
