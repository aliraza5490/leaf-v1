"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  listConversations,
  updateConversation,
  deleteConversation,
  bulkConversations,
  sendAgentReply,
} from "@/lib/conversations/api";
import type { ConversationFilters } from "@/lib/conversations/types";
import type { Conversation } from "@/types/conversation";

export function useConversations(filters: ConversationFilters) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mutating, setMutating] = useState(false);

  const seqRef = useRef(0);

  useEffect(() => {
    const seq = ++seqRef.current;

    const params = {
      q: filters.search || undefined,
      status: filters.status !== "all" ? filters.status : undefined,
      channel: filters.channel !== "all" ? filters.channel : undefined,
      sort_field: filters.sortField,
      sort_dir: filters.sortDirection,
      page: filters.page,
      page_size: filters.pageSize,
    };

    const timer = setTimeout(() => {
      setLoading(true);
      listConversations(params)
        .then((data) => {
          if (seq !== seqRef.current) return;
          setConversations(data.conversations);
          setTotal(data.total);
          setError(null);
        })
        .catch((err: unknown) => {
          if (seq !== seqRef.current) return;
          const message = err instanceof Error ? err.message : "Failed to load conversations";
          setError(message);
        })
        .finally(() => {
          if (seq === seqRef.current) setLoading(false);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [
    filters.search,
    filters.status,
    filters.channel,
    filters.sortField,
    filters.sortDirection,
    filters.page,
    filters.pageSize,
  ]);

  const refetch = useCallback(() => {
    seqRef.current++;
    setLoading(true);
    const params = {
      q: filters.search || undefined,
      status: filters.status !== "all" ? filters.status : undefined,
      channel: filters.channel !== "all" ? filters.channel : undefined,
      sort_field: filters.sortField,
      sort_dir: filters.sortDirection,
      page: filters.page,
      page_size: filters.pageSize,
    };
    listConversations(params)
      .then((data) => {
        setConversations(data.conversations);
        setTotal(data.total);
        setError(null);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Failed to load conversations";
        setError(message);
      })
      .finally(() => setLoading(false));
  }, [
    filters.search,
    filters.status,
    filters.channel,
    filters.sortField,
    filters.sortDirection,
    filters.page,
    filters.pageSize,
  ]);

  const resolveConversation = useCallback(
    async (id: string) => {
      setMutating(true);
      try {
        await updateConversation(id, { status: "resolved" });
        toast.success("Conversation resolved.");
        refetch();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to resolve conversation";
        toast.error(message);
        throw err;
      } finally {
        setMutating(false);
      }
    },
    [refetch]
  );

  const assignConversation = useCallback(
    async (id: string, assignedTo: string) => {
      setMutating(true);
      try {
        await updateConversation(id, { assigned_to: assignedTo });
        toast.success("Conversation assigned.");
        refetch();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to assign conversation";
        toast.error(message);
        throw err;
      } finally {
        setMutating(false);
      }
    },
    [refetch]
  );

  const removeConversation = useCallback(
    async (id: string) => {
      setMutating(true);
      try {
        await deleteConversation(id);
        toast.success("Conversation deleted.");
        refetch();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to delete conversation";
        toast.error(message);
        throw err;
      } finally {
        setMutating(false);
      }
    },
    [refetch]
  );

  const bulkResolve = useCallback(
    async (ids: string[]) => {
      setMutating(true);
      try {
        await bulkConversations("resolve", ids);
        toast.success(`${ids.length} conversation(s) resolved.`);
        refetch();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to resolve conversations";
        toast.error(message);
        throw err;
      } finally {
        setMutating(false);
      }
    },
    [refetch]
  );

  const bulkAssign = useCallback(
    async (ids: string[], assignedTo: string) => {
      setMutating(true);
      try {
        await bulkConversations("assign", ids, assignedTo);
        toast.success(`${ids.length} conversation(s) assigned.`);
        refetch();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to assign conversations";
        toast.error(message);
        throw err;
      } finally {
        setMutating(false);
      }
    },
    [refetch]
  );

  const bulkArchive = useCallback(
    async (ids: string[]) => {
      setMutating(true);
      try {
        await bulkConversations("archive", ids);
        toast.success(`${ids.length} conversation(s) archived.`);
        refetch();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to archive conversations";
        toast.error(message);
        throw err;
      } finally {
        setMutating(false);
      }
    },
    [refetch]
  );

  const bulkDelete = useCallback(
    async (ids: string[]) => {
      setMutating(true);
      try {
        await bulkConversations("delete", ids);
        toast.success(`${ids.length} conversation(s) deleted.`);
        refetch();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to delete conversations";
        toast.error(message);
        throw err;
      } finally {
        setMutating(false);
      }
    },
    [refetch]
  );

  const sendReply = useCallback(
    async (conversationId: string, content: string) => {
      setMutating(true);
      try {
        await sendAgentReply(conversationId, content);
        toast.success("Reply sent.");
        refetch();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to send reply";
        toast.error(message);
        throw err;
      } finally {
        setMutating(false);
      }
    },
    [refetch]
  );

  return {
    conversations,
    total,
    loading,
    error,
    mutating,
    resolveConversation,
    assignConversation,
    removeConversation,
    bulkResolve,
    bulkAssign,
    bulkArchive,
    bulkDelete,
    sendReply,
    refetch,
  };
}
