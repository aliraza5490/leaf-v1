"use client";

import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  listConversations,
  updateConversation,
  deleteConversation,
  bulkConversations,
  sendAgentReply,
  getConversationStats,
  getConversationTrends,
  getRecentConversations,
  getAnalyticsChannels,
  getAnalyticsHeatmap,
  getAnalyticsTopProducts,
} from "@/lib/api/conversations";
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
    queryFn: () => listConversations(params),
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
    queryClient.invalidateQueries({ queryKey: ["conversationStats"] });
  }, [queryClient]);

  const resolveMutation = useMutation({
    mutationFn: (id: string) => updateConversation(id, { status: "resolved" }),
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
    mutationFn: ({ id, assignedTo }: { id: string; assignedTo: string }) =>
      updateConversation(id, { assigned_to: assignedTo }),
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
    mutationFn: (id: string) => deleteConversation(id),
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
    mutationFn: (ids: string[]) => bulkConversations("resolve", ids),
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
    mutationFn: ({ ids, assignedTo }: { ids: string[]; assignedTo: string }) =>
      bulkConversations("assign", ids, assignedTo),
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
    mutationFn: (ids: string[]) => bulkConversations("archive", ids),
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
    mutationFn: (ids: string[]) => bulkConversations("delete", ids),
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
    mutationFn: ({ conversationId, content }: { conversationId: string; content: string }) =>
      sendAgentReply(conversationId, content),
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
