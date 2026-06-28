import type { Message } from '@/lib/types';
import { ProductCarousel } from './product-carousel';
import { Markdown } from './markdown';
import { AvatarIcon } from './icons';

interface MessageBubbleProps {
  message: Message;
  primaryColor: string;
}

export function MessageBubble({ message, primaryColor }: MessageBubbleProps) {
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
          <ProductCarousel products={message.products!} primaryColor={primaryColor} />
        </div>
      )}
    </>
  );
}
