import type { Message, Product } from '@/lib/types';
import { ProductCarousel } from '@/components/ui/product-carousel';
import { Markdown } from '@/components/ui/markdown';
import { AvatarIcon } from '@/components/ui/icons';

interface MessageBubbleProps {
  message: Message;
  primaryColor: string;
  onAddToCart?: (product: Product) => void;
}

export function MessageBubble({ message, primaryColor, onAddToCart }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const hasProducts = !isUser && message.products && message.products.length > 0;

  return (
    <>
      <div className={`flex items-end gap-2 ${hasProducts ? 'mb-1' : 'mb-3'} ${isUser ? 'flex-row-reverse' : ''}`}>
        {!isUser && (
          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <AvatarIcon size={14} color="#6b7280" />
          </div>
        )}
        <div className={`max-w-[80%] ${isUser ? 'ml-auto' : ''}`}>
          <div
            className={`px-3.5 py-2.5 text-sm leading-relaxed ${isUser
                ? 'text-white rounded-2xl rounded-br-sm'
                : 'text-gray-800 bg-gray-100 rounded-2xl rounded-bl-sm'
              }`}
            style={isUser ? { backgroundColor: primaryColor } : undefined}
          >
            {isUser ? message.content : <Markdown content={message.content} primaryColor={primaryColor} />}
          </div>
        </div>
      </div>
      {hasProducts && (
        <div className="mb-3 pl-4 animate-leaf-slide-up">
          <ProductCarousel products={message.products!} primaryColor={primaryColor} onAddToCart={onAddToCart} />
        </div>
      )}
    </>
  );
}
