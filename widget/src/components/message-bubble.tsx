import type { Message } from '@/lib/types';
import { ProductCarousel } from './product-carousel';
import { Markdown } from './markdown';

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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          </div>
        )}
        <div className={`max-w-[80%] ${isUser ? 'ml-auto' : ''}`}>
          <div
            className={`px-3.5 py-2.5 text-sm leading-relaxed ${
              isUser
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
        <div className="mb-3 animate-leaf-slide-up">
          <ProductCarousel products={message.products!} primaryColor={primaryColor} />
        </div>
      )}
    </>
  );
}
