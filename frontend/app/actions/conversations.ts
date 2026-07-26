"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import {
  listConversations,
  getConversation,
  updateConversation,
  deleteConversation,
  bulkConversations,
  sendAgentReply,
  getConversationStats,
  getConversationTrends,
  getRecentConversations,
  getAnalyticsSummary,
  getAnalyticsVolume,
  getAnalyticsChannels,
  getAnalyticsHeatmap,
  getAnalyticsTopProducts,
  type ConversationQueryParams,
} from "@/lib/api/conversations";
import type { ActionResponse } from "@/app/actions/auth";
import type {
  ConversationListResponse,
  ConversationStats,
  TrendsResponse,
  ChannelsResponse,
  TopProductsResponse,
} from "@/types";
import type { Conversation, Message } from "@/app/(pages)/dashboard/(pages)/conversations/types";

const conversationQueryParamsSchema = z.object({
  q: z.string().optional(),
  status: z.string().optional(),
  channel: z.string().optional(),
  sort_field: z.string().optional(),
  sort_dir: z.string().optional(),
  page: z.number().optional(),
  page_size: z.number().optional(),
});

const updateConversationSchema = z.object({
  id: z.string().min(1),
  status: z.string().optional(),
  assigned_to: z.string().optional(),
  tags: z.string().optional(),
});

const deleteConversationSchema = z.object({
  id: z.string().min(1),
});

const bulkConversationsSchema = z.object({
  action: z.enum(["resolve", "assign", "archive", "delete"]),
  ids: z.array(z.string()).min(1),
  assignedTo: z.string().optional(),
});

const sendAgentReplySchema = z.object({
  conversationId: z.string().min(1),
  content: z.string().min(1, "Reply content cannot be empty"),
});

export async function listConversationsAction(
  params: ConversationQueryParams = {}
): Promise<ActionResponse<ConversationListResponse>> {
  const result = conversationQueryParamsSchema.safeParse(params);
  if (!result.success) {
    return { success: false, error: "Invalid query parameters" };
  }
  try {
    const res = await listConversations(result.data);
    return { success: true, data: res };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to fetch conversations",
    };
  }
}

export async function getConversationAction(
  id: string
): Promise<ActionResponse<Conversation>> {
  if (!id) return { success: false, error: "Conversation ID is required" };
  try {
    const res = await getConversation(id);
    return { success: true, data: res };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to fetch conversation",
    };
  }
}

export async function updateConversationAction(
  input: z.infer<typeof updateConversationSchema>
): Promise<ActionResponse<Conversation>> {
  const result = updateConversationSchema.safeParse(input);
  if (!result.success) {
    return {
      success: false,
      error: "Validation error",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { id, ...patch } = result.data;
  try {
    const res = await updateConversation(id, patch);
    revalidatePath("/dashboard/conversations");
    revalidatePath(`/dashboard/conversations/${id}`);
    revalidatePath("/dashboard");
    return { success: true, data: res };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update conversation",
    };
  }
}

export async function deleteConversationAction(
  id: string
): Promise<ActionResponse<void>> {
  const result = deleteConversationSchema.safeParse({ id });
  if (!result.success) {
    return { success: false, error: "Invalid conversation ID" };
  }
  try {
    await deleteConversation(id);
    revalidatePath("/dashboard/conversations");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete conversation",
    };
  }
}

export async function bulkConversationsAction(
  input: z.infer<typeof bulkConversationsSchema>
): Promise<ActionResponse<{ count: number }>> {
  const result = bulkConversationsSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: "Validation error on bulk operation" };
  }
  try {
    const res = await bulkConversations(
      result.data.action,
      result.data.ids,
      result.data.assignedTo
    );
    revalidatePath("/dashboard/conversations");
    revalidatePath("/dashboard");
    return { success: true, data: res };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to execute bulk operation",
    };
  }
}

export async function sendAgentReplyAction(
  input: z.infer<typeof sendAgentReplySchema>
): Promise<ActionResponse<Message>> {
  const result = sendAgentReplySchema.safeParse(input);
  if (!result.success) {
    return {
      success: false,
      error: "Validation error",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const res = await sendAgentReply(
      result.data.conversationId,
      result.data.content
    );
    revalidatePath("/dashboard/conversations");
    revalidatePath(`/dashboard/conversations/${result.data.conversationId}`);
    return { success: true, data: res };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to send agent reply",
    };
  }
}

export async function getConversationStatsAction(): Promise<ActionResponse<ConversationStats>> {
  try {
    const res = await getConversationStats();
    return { success: true, data: res };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to fetch stats",
    };
  }
}

export async function getConversationTrendsAction(
  rangeDays: number = 7
): Promise<ActionResponse<TrendsResponse>> {
  try {
    const res = await getConversationTrends(rangeDays);
    return { success: true, data: res };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to fetch trends",
    };
  }
}

export async function getRecentConversationsAction(
  limit: number = 5
): Promise<ActionResponse<ConversationListResponse>> {
  try {
    const res = await getRecentConversations(limit);
    return { success: true, data: res };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to fetch recent conversations",
    };
  }
}

export async function getAnalyticsSummaryAction(): Promise<ActionResponse<ConversationStats>> {
  try {
    const res = await getAnalyticsSummary();
    return { success: true, data: res };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to fetch summary" };
  }
}

export async function getAnalyticsVolumeAction(rangeDays: number = 30): Promise<ActionResponse<TrendsResponse>> {
  try {
    const res = await getAnalyticsVolume(rangeDays);
    return { success: true, data: res };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to fetch volume" };
  }
}

export async function getAnalyticsChannelsAction(): Promise<ActionResponse<ChannelsResponse>> {
  try {
    const res = await getAnalyticsChannels();
    return { success: true, data: res };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to fetch channels" };
  }
}

export async function getAnalyticsHeatmapAction(): Promise<ActionResponse<{ heatmap: Record<string, Record<string, number>> }>> {
  try {
    const res = await getAnalyticsHeatmap();
    return { success: true, data: res };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to fetch heatmap" };
  }
}

export async function getAnalyticsTopProductsAction(limit: number = 10): Promise<ActionResponse<TopProductsResponse>> {
  try {
    const res = await getAnalyticsTopProducts(limit);
    return { success: true, data: res };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to fetch top products" };
  }
}
