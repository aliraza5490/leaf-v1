export type ConversationStatus = "active" | "waiting" | "resolved" | "archived";
export type MessageSender = "visitor" | "ai" | "agent";
export type ConversationChannel = "chat" | "voice";

export interface Product {
  id: string;
  title: string;
  price: number;
  rating: number;
  image: string;
  url: string;
}

export interface Message {
  id: string;
  sender: MessageSender;
  content: string;
  timestamp: string;
  productCard?: Product;
  read: boolean;
}

export interface Visitor {
  name: string;
  email: string;
  avatar?: string;
}

export interface Conversation {
  id: string;
  visitor: Visitor;
  status: ConversationStatus;
  channel?: ConversationChannel;
  messages: Message[];
  startedAt: string;
  lastActivity: string;
  assignedTo?: string;
  tags: string[];
  audioRecordingUrl?: string;
  metadata: {
    pagesVisited: number;
    sessionDuration: string;
    source: string;
  };
}
