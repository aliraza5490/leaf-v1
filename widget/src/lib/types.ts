export type WidgetPosition = 'bottom-right' | 'bottom-left';
export type WidgetTheme = 'light' | 'dark' | 'auto';

export interface WidgetConfig {
  storeId: number;
  apiUrl?: string;
  assetsBaseUrl?: string;
  position?: WidgetPosition;
  theme?: WidgetTheme;
  primaryColor?: string;
  storeName?: string;
  storeLogo?: string;
  greeting?: string;
  placeholder?: string;
  showBranding?: boolean;
  products?: RawProduct[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  url?: string;
  description?: string;
}

export interface RawProduct {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  images?: string[];
  url?: string;
  description?: string;
}

export function normalizeProduct(p: RawProduct): Product {
  return {
    id: String(p.id),
    name: p.name,
    price: p.price,
    image: p.image ?? p.images?.[0] ?? '',
    url: p.url,
    description: p.description,
  };
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'agent';
  content: string;
  products?: Product[];
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isOpen: boolean;
  isTyping: boolean;
  isCallActive: boolean;
  sessionId?: string;
  visitorInfo?: { name: string; email: string };
}

export interface SSEEvent {
  type: 'token' | 'products' | 'done' | 'error';
  content?: string;
  products?: RawProduct[];
}

export type VoiceState = 'idle' | 'connecting' | 'listening' | 'processing' | 'speaking' | 'error';
