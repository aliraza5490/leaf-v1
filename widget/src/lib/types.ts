export type WidgetPosition = 'bottom-right' | 'bottom-left';
export type WidgetTheme = 'light' | 'dark' | 'auto';

export interface WidgetConfig {
  storeId: string;
  apiUrl?: string;
  position?: WidgetPosition;
  theme?: WidgetTheme;
  primaryColor?: string;
  storeName?: string;
  storeLogo?: string;
  greeting?: string;
  placeholder?: string;
  showBranding?: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  url?: string;
  description?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
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
}

export interface SSEEvent {
  type: 'token' | 'products' | 'done' | 'error';
  content?: string;
  products?: Product[];
}
