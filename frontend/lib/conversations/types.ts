import type { Conversation, ConversationStatus, ConversationChannel } from "@/types/conversation";

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

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface TeamResponse {
  team: TeamMember[];
}
