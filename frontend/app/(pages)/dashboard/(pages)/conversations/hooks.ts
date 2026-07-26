"use client";

import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  listConversationsAction,
  updateConversationAction,
  deleteConversationAction,
  bulkConversationsAction,
  sendAgentReplyAction,
  getConversationStatsAction,
  getConversationTrendsAction,
  getRecentConversationsAction,
  getAnalyticsChannelsAction,
  getAnalyticsHeatmapAction,
  getAnalyticsTopProductsAction,
} from "@/app/actions/conversations";
import type { ConversationFilters } from "@/app/(pages)/dashboard/(pages)/conversations/types";

export function useConversations(filters: ConversationFilters) {
  const queryClient = useQueryClient();

  const params = {
    q: filters.search || undefined,
    status: filters.status !== "all" ? filters.status : undefined,
    channel: filters.channel !== "all" ? filters.channel : undefined,
    sort_field: filters.sortField,
    sort_dir: filters.sortDirection,
    page: filters.page,
    page_size: filters.pageSize,
  };

  const query = useQuery({
    queryKey: ["conversations", params],
    queryFn: async () => {
      const res = await listConversationsAction(params);
      if (!res.success) throw new Error(res.error || "Failed to load conversations");
      return res.data;
    },
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
    queryClient.invalidateQueries({ queryKey: ["conversationStats"] });
  }, [queryClient]);

  const resolveMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await updateConversationAction({ id, status: "resolved" });
      if (!res.success) throw new Error(res.error || "Failed to resolve conversation");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Conversation resolved.");
      invalidate();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to resolve conversation";
      toast.error(message);
    },
  });

  const assignMutation = useMutation({
    mutationFn: async ({ id, assignedTo }: { id: string; assignedTo: string }) => {
      const res = await updateConversationAction({ id, assigned_to: assignedTo });
      if (!res.success) throw new Error(res.error || "Failed to assign conversation");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Conversation assigned.");
      invalidate();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to assign conversation";
      toast.error(message);
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteConversationAction(id);
      if (!res.success) throw new Error(res.error || "Failed to delete conversation");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Conversation deleted.");
      invalidate();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to delete conversation";
      toast.error(message);
    },
  });

  const bulkResolveMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await bulkConversationsAction({ action: "resolve", ids });
      if (!res.success) throw new Error(res.error || "Failed to resolve conversations");
      return res.data;
    },
    onSuccess: (_, ids) => {
      toast.success(`${ids.length} conversation(s) resolved.`);
      invalidate();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to resolve conversations";
      toast.error(message);
    },
  });

  const bulkAssignMutation = useMutation({
    mutationFn: async ({ ids, assignedTo }: { ids: string[]; assignedTo: string }) => {
      const res = await bulkConversationsAction({ action: "assign", ids, assignedTo });
      if (!res.success) throw new Error(res.error || "Failed to assign conversations");
      return res.data;
    },
    onSuccess: (_, { ids }) => {
      toast.success(`${ids.length} conversation(s) assigned.`);
      invalidate();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to assign conversations";
      toast.error(message);
    },
  });

  const bulkArchiveMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await bulkConversationsAction({ action: "archive", ids });
      if (!res.success) throw new Error(res.error || "Failed to archive conversations");
      return res.data;
    },
    onSuccess: (_, ids) => {
      toast.success(`${ids.length} conversation(s) archived.`);
      invalidate();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to archive conversations";
      toast.error(message);
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await bulkConversationsAction({ action: "delete", ids });
      if (!res.success) throw new Error(res.error || "Failed to delete conversations");
      return res.data;
    },
    onSuccess: (_, ids) => {
      toast.success(`${ids.length} conversation(s) deleted.`);
      invalidate();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to delete conversations";
      toast.error(message);
    },
  });

  const sendReplyMutation = useMutation({
    mutationFn: async ({ conversationId, content }: { conversationId: string; content: string }) => {
      const res = await sendAgentReplyAction({ conversationId, content });
      if (!res.success) throw new Error(res.error || "Failed to send reply");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Reply sent.");
      invalidate();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to send reply";
      toast.error(message);
    },
  });

  const resolveConversation = useCallback(
    (id: string) => resolveMutation.mutateAsync(id),
    [resolveMutation]
  );

  const assignConversation = useCallback(
    (id: string, assignedTo: string) => assignMutation.mutateAsync({ id, assignedTo }),
    [assignMutation]
  );

  const removeConversation = useCallback(
    (id: string) => removeMutation.mutateAsync(id),
    [removeMutation]
  );

  const bulkResolve = useCallback(
    (ids: string[]) => bulkResolveMutation.mutateAsync(ids),
    [bulkResolveMutation]
  );

  const bulkAssign = useCallback(
    (ids: string[], assignedTo: string) => bulkAssignMutation.mutateAsync({ ids, assignedTo }),
    [bulkAssignMutation]
  );

  const bulkArchive = useCallback(
    (ids: string[]) => bulkArchiveMutation.mutateAsync(ids),
    [bulkArchiveMutation]
  );

  const bulkDelete = useCallback(
    (ids: string[]) => bulkDeleteMutation.mutateAsync(ids),
    [bulkDeleteMutation]
  );

  const sendReply = useCallback(
    (conversationId: string, content: string) =>
      sendReplyMutation.mutateAsync({ conversationId, content }),
    [sendReplyMutation]
  );

  const isMutating =
    resolveMutation.isPending ||
    assignMutation.isPending ||
    removeMutation.isPending ||
    bulkResolveMutation.isPending ||
    bulkAssignMutation.isPending ||
    bulkArchiveMutation.isPending ||
    bulkDeleteMutation.isPending ||
    sendReplyMutation.isPending;

  return {
    conversations: query.data?.conversations ?? [],
    total: query.data?.total ?? 0,
    loading: query.isLoading,
    error: query.error ? (query.error instanceof Error ? query.error.message : "Failed to load conversations") : null,
    mutating: isMutating,
    resolveConversation,
    assignConversation,
    removeConversation,
    bulkResolve,
    bulkAssign,
    bulkArchive,
    bulkDelete,
    sendReply,
    refetch: query.refetch,
  };
}

export function useConversationStats() {
  const query = useQuery({
    queryKey: ["conversationStats"],
    queryFn: async () => {
      const res = await getConversationStatsAction();
      if (!res.success) throw new Error(res.error || "Failed to load stats");
      return res.data;
    },
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
    queryFn: async () => {
      const res = await getConversationTrendsAction(rangeDays);
      if (!res.success) throw new Error(res.error || "Failed to load trends");
      return res.data;
    },
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
    queryFn: async () => {
      const res = await getRecentConversationsAction(limit);
      if (!res.success) throw new Error(res.error || "Failed to load recent conversations");
      return res.data;
    },
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
    queryFn: async () => {
      const res = await getAnalyticsChannelsAction();
      if (!res.success) throw new Error(res.error || "Failed to load channels");
      return res.data;
    },
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
    queryFn: async () => {
      const res = await getAnalyticsHeatmapAction();
      if (!res.success) throw new Error(res.error || "Failed to load heatmap");
      return res.data;
    },
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
    queryFn: async () => {
      const res = await getAnalyticsTopProductsAction(limit);
      if (!res.success) throw new Error(res.error || "Failed to load top products");
      return res.data;
    },
  });

  return {
    products: query.data ?? null,
    loading: query.isLoading,
    error: query.error ? (query.error instanceof Error ? query.error.message : "Failed to load top products") : null,
    refetch: query.refetch,
  };
}
