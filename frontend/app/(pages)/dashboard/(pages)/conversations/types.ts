export type ConversationStatus = "active" | "waiting" | "resolved" | "archived";
export type MessageSender = "visitor" | "ai" | "agent";
export type ConversationChannel = "chat" | "voice";

export interface ConversationProduct {
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
  productCard?: ConversationProduct;
  products?: ConversationProduct[];
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

export interface ConversationFilters {
  search: string;
  status: ConversationStatus | "all";
  channel: ConversationChannel | "all";
  sortField: "updated_at" | "created_at";
  sortDirection: "asc" | "desc";
  page: number;
  pageSize: number;
}

export interface ConversationListResponse {
  conversations: Conversation[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ConversationStats {
  total: number;
  active: number;
  resolved: number;
  waiting: number;
  avgResponseTime: string;
  conversionRate: string;
}

export interface TrendPoint {
  date: string;
  conversations: number;
  resolved: number;
}

export interface TrendsResponse {
  trends: TrendPoint[];
}

export interface ChannelDistribution {
  channel: string;
  count: number;
}

export interface ChannelsResponse {
  channels: ChannelDistribution[];
}

export interface TopProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  count: number;
}

export interface TopProductsResponse {
  products: TopProduct[];
}

export interface ConversationTeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface TeamResponse {
  team: ConversationTeamMember[];
}
