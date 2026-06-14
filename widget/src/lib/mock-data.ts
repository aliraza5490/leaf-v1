import type { Product } from './types';

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Organic Green Tea',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=200&h=200&fit=crop',
    url: '#',
    description: 'Premium Japanese sencha green tea, 100g loose leaf',
  },
  {
    id: 'p2',
    name: 'Bamboo Water Bottle',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&h=200&fit=crop',
    url: '#',
    description: 'Eco-friendly insulated bottle with bamboo cap',
  },
  {
    id: 'p3',
    name: 'Cotton Tote Bag',
    price: 18.50,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&h=200&fit=crop',
    url: '#',
    description: 'Reusable organic cotton canvas tote',
  },
  {
    id: 'p4',
    name: 'Natural Soy Candle',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=200&h=200&fit=crop',
    url: '#',
    description: 'Hand-poured lavender & vanilla soy wax candle',
  },
];

interface MockResponse {
  keywords: string[];
  reply: string;
  products?: Product[];
}

export const mockResponses: MockResponse[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
    reply: "Hello! Welcome! I'm here to help you find exactly what you need. What are you looking for today?",
  },
  {
    keywords: ['product', 'products', 'show', 'recommend', 'suggest', 'browse', 'catalog'],
    reply: "Here are some of our popular items! Each one is carefully selected for quality and sustainability.",
    products: mockProducts,
  },
  {
    keywords: ['tea', 'green tea', 'drink', 'beverage'],
    reply: "Our Organic Green Tea is a customer favorite! It's a premium Japanese sencha with a smooth, refreshing taste.",
    products: [mockProducts[0]],
  },
  {
    keywords: ['bottle', 'water', 'drink'],
    reply: "This Bamboo Water Bottle keeps drinks cold for 24 hours and hot for 12. Plus, it's fully eco-friendly!",
    products: [mockProducts[1]],
  },
  {
    keywords: ['bag', 'tote', 'carry'],
    reply: "Our Cotton Tote Bag is made from 100% organic cotton. Perfect for shopping or everyday use!",
    products: [mockProducts[2]],
  },
  {
    keywords: ['candle', 'scent', 'fragrance'],
    reply: "Our Natural Soy Candle is hand-poured with lavender and vanilla essential oils. Burns for 40+ hours!",
    products: [mockProducts[3]],
  },
  {
    keywords: ['shipping', 'delivery', 'ship'],
    reply: "We offer free shipping on orders over $50! Standard delivery takes 3-5 business days. Express shipping is also available.",
  },
  {
    keywords: ['return', 'refund', 'exchange'],
    reply: "We have a 30-day return policy. Items must be unused and in original packaging. Would you like me to help you with a return?",
  },
  {
    keywords: ['price', 'cost', 'how much', 'cheap', 'expensive'],
    reply: "Our products range from $12.99 to $24.99. Would you like to see our full catalog?",
    products: mockProducts,
  },
  {
    keywords: ['thank', 'thanks', 'bye', 'goodbye'],
    reply: "You're welcome! Feel free to come back anytime you need help. Happy shopping!",
  },
];

export const fallbackResponses = [
  "That's a great question! Let me look into that for you. In the meantime, would you like to see our product catalog?",
  "I'd be happy to help with that! Could you tell me a bit more about what you're looking for?",
  "I'm not quite sure about that, but I can help you find products or answer questions about shipping and returns!",
];
