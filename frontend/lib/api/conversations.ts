import { serverApiGet, serverApiPost, serverApiDelete, serverApiPut } from "@/lib/api/server";
import type {
  ConversationListResponse,
  ConversationStats,
  TrendsResponse,
  ChannelsResponse,
  TopProductsResponse,
  TeamResponse,
} from "@/types";
import type { Conversation, Message, ConversationStatus, ConversationChannel } from "@/app/(pages)/dashboard/(pages)/conversations/types";

interface BackendVisitor {
  name: string;
  email: string;
}

interface BackendMetadata {
  pagesVisited: number;
  sessionDuration: string;
  source: string;
}

interface BackendMessage {
  id: number;
  sender: string;
  content: string;
  products: BackendProduct[];
  read: boolean;
  timestamp: string;
}

interface BackendProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  url?: string;
}

interface BackendConversation {
  id: string;
  store_id: number;
  channel: string;
  status: string;
  assigned_to: string | null;
  visitor: BackendVisitor;
  tags: string[];
  metadata: BackendMetadata;
  started_at: string;
  last_activity: string;
  message_count: number;
  last_message: BackendMessage | null;
  audio_recording_url?: string | null;
  messages?: BackendMessage[];
}

interface BackendListResponse {
  conversations: BackendConversation[];
  total: number;
  page: number;
  page_size: number;
}

interface BackendStats {
  total: number;
  active: number;
  resolved: number;
  waiting: number;
  avg_response_time: string;
  conversion_rate: string;
}

function toProduct(p: BackendProduct): { id: string; title: string; price: number; rating: number; image: string; url: string } {
  return {
    id: String(p.id),
    title: p.name,
    price: p.price,
    rating: 0,
    image: p.image || "",
    url: p.url || "",
  };
}

function toMessage(m: BackendMessage): Message {
  const productCard = m.products && m.products.length > 0 ? toProduct(m.products[0]) : undefined;
  const products = m.products && m.products.length > 0 ? m.products.map(toProduct) : undefined;
  return {
    id: String(m.id),
    sender: m.sender as Message["sender"],
    content: m.content,
    timestamp: m.timestamp,
    productCard,
    products,
    read: m.read,
  };
}

function toConversation(c: BackendConversation): Conversation {
  const messages = c.messages ? c.messages.map(toMessage) : [];
  return {
    id: c.id,
    visitor: c.visitor,
    status: c.status as ConversationStatus,
    channel: c.channel as ConversationChannel,
    messages,
    startedAt: c.started_at,
    lastActivity: c.last_activity,
    assignedTo: c.assigned_to || undefined,
    tags: c.tags,
    audioRecordingUrl: c.audio_recording_url || undefined,
    metadata: c.metadata,
  };
}

export interface ConversationQueryParams {
  q?: string;
  status?: string;
  channel?: string;
  sort_field?: string;
  sort_dir?: string;
  page?: number;
  page_size?: number;
  [key: string]: string | number | undefined;
}

export async function listConversations(
  params: ConversationQueryParams
): Promise<ConversationListResponse> {
  const data = await serverApiGet<BackendListResponse>("/conversations/", params);
  return {
    conversations: data.conversations.map(toConversation),
    total: data.total,
    page: data.page,
    pageSize: data.page_size,
  };
}

export async function getConversation(id: string): Promise<Conversation> {
  const data = await serverApiGet<BackendConversation>(`/conversations/${id}`);
  return toConversation(data);
}

export async function updateConversation(
  id: string,
  patch: { status?: string; assigned_to?: string; tags?: string }
): Promise<Conversation> {
  const data = await serverApiPut<BackendConversation>(`/conversations/${id}`, patch);
  return toConversation(data);
}

export async function deleteConversation(id: string): Promise<void> {
  await serverApiDelete<{ conversation_id: string }>(`/conversations/${id}`);
}

export async function bulkConversations(
  action: string,
  ids: string[],
  assignedTo?: string
): Promise<{ count: number }> {
  return serverApiPost<{ count: number }>("/conversations/bulk", {
    action,
    ids,
    assigned_to: assignedTo,
  });
}

export async function sendAgentReply(
  conversationId: string,
  content: string
): Promise<Message> {
  const data = await serverApiPost<BackendMessage>(`/conversations/${conversationId}/messages`, {
    content,
  });
  return toMessage(data);
}

export async function getConversationStats(): Promise<ConversationStats> {
  const data = await serverApiGet<BackendStats>("/conversations/stats");
  return {
    total: data.total,
    active: data.active,
    resolved: data.resolved,
    waiting: data.waiting,
    avgResponseTime: data.avg_response_time,
    conversionRate: data.conversion_rate,
  };
}

export async function getConversationTrends(rangeDays: number = 7): Promise<TrendsResponse> {
  return serverApiGet<TrendsResponse>("/conversations/trends", { range_days: rangeDays });
}

export async function getRecentConversations(limit: number = 5): Promise<ConversationListResponse> {
  const data = await serverApiGet<{ conversations: BackendConversation[] }>("/conversations/recent", { limit });
  return {
    conversations: data.conversations.map(toConversation),
    total: data.conversations.length,
    page: 1,
    pageSize: limit,
  };
}

export async function getAnalyticsSummary(): Promise<ConversationStats> {
  return serverApiGet<ConversationStats>("/conversations/analytics/summary");
}

export async function getAnalyticsVolume(rangeDays: number = 30): Promise<TrendsResponse> {
  return serverApiGet<TrendsResponse>("/conversations/analytics/volume", { range_days: rangeDays });
}

export async function getAnalyticsChannels(): Promise<ChannelsResponse> {
  return serverApiGet<ChannelsResponse>("/conversations/analytics/channels");
}

export async function getAnalyticsHeatmap(): Promise<{ heatmap: Record<string, Record<string, number>> }> {
  return serverApiGet<{ heatmap: Record<string, Record<string, number>> }>("/conversations/analytics/heatmap");
}

export async function getAnalyticsTopProducts(limit: number = 10): Promise<TopProductsResponse> {
  return serverApiGet<TopProductsResponse>("/conversations/analytics/top-products", { limit });
}

export async function getTeam(): Promise<TeamResponse> {
  return serverApiGet<TeamResponse>("/team/");
}
