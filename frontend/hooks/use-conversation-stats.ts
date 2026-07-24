"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getConversationStats,
  getConversationTrends,
  getRecentConversations,
  getAnalyticsChannels,
  getAnalyticsHeatmap,
  getAnalyticsTopProducts,
} from "@/lib/conversations/api";

export function useConversationStats() {
  const query = useQuery({
    queryKey: ["conversationStats"],
    queryFn: getConversationStats,
  });

  return {
    stats: query.data ?? null,
    loading: query.isLoading,
    error: query.error ? (query.error instanceof Error ? query.error.message : "Failed to load stats") : null,
    refetch: query.refetch,
  };
}

export function useConversationTrends(rangeDays: number = 7) {
  const query = useQuery({
    queryKey: ["conversationTrends", rangeDays],
    queryFn: () => getConversationTrends(rangeDays),
  });

  return {
    trends: query.data ?? null,
    loading: query.isLoading,
    error: query.error ? (query.error instanceof Error ? query.error.message : "Failed to load trends") : null,
    refetch: query.refetch,
  };
}

export function useRecentConversations(limit: number = 5, pollInterval?: number) {
  const query = useQuery({
    queryKey: ["recentConversations", limit],
    queryFn: () => getRecentConversations(limit),
    refetchInterval: pollInterval && pollInterval > 0 ? pollInterval : false,
  });

  return {
    conversations: query.data?.conversations ?? [],
    loading: query.isLoading,
    error: query.error ? (query.error instanceof Error ? query.error.message : "Failed to load recent conversations") : null,
    refetch: query.refetch,
  };
}

export function useAnalyticsChannels() {
  const query = useQuery({
    queryKey: ["analyticsChannels"],
    queryFn: getAnalyticsChannels,
  });

  return {
    channels: query.data ?? null,
    loading: query.isLoading,
    error: query.error ? (query.error instanceof Error ? query.error.message : "Failed to load channels") : null,
    refetch: query.refetch,
  };
}

export function useAnalyticsHeatmap() {
  const query = useQuery({
    queryKey: ["analyticsHeatmap"],
    queryFn: getAnalyticsHeatmap,
  });

  return {
    heatmap: query.data?.heatmap ?? null,
    loading: query.isLoading,
    error: query.error ? (query.error instanceof Error ? query.error.message : "Failed to load heatmap") : null,
    refetch: query.refetch,
  };
}

export function useAnalyticsTopProducts(limit: number = 10) {
  const query = useQuery({
    queryKey: ["analyticsTopProducts", limit],
    queryFn: () => getAnalyticsTopProducts(limit),
  });

  return {
    products: query.data ?? null,
    loading: query.isLoading,
    error: query.error ? (query.error instanceof Error ? query.error.message : "Failed to load top products") : null,
    refetch: query.refetch,
  };
}
