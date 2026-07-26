"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import { ConversationList } from "./conversation-list";
import { ConversationFilters } from "./conversation-filters";
import { BulkActions } from "./bulk-actions";
import { useConversations } from "@/app/(pages)/dashboard/(pages)/conversations/hooks";
import { getTeamAction } from "@/app/actions/team";
import type { ConversationStatus, ConversationChannel, ConversationTeamMember } from "@/app/(pages)/dashboard/(pages)/conversations/types";

export function ConversationListPanel({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const base = "/dashboard/conversations";
  const selectedId = pathname !== base && pathname.startsWith(base + "/")
    ? pathname.slice(base.length + 1)
    : null;

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [activeFilter, setActiveFilter] = useState<ConversationStatus | "all">("all");
  const [activeChannel, setActiveChannel] = useState<ConversationChannel | "all">("all");
  const [teamMembers, setTeamMembers] = useState<ConversationTeamMember[]>([]);

  const {
    conversations,
    loading,
    bulkResolve,
    bulkAssign,
    bulkArchive,
    bulkDelete,
  } = useConversations({
    search: searchQuery,
    status: "all",
    channel: "all",
    sortField: sortBy === "recent" ? "updated_at" : sortBy === "oldest" ? "created_at" : "updated_at",
    sortDirection: "desc",
    page: 1,
    pageSize: 100,
  });

  useEffect(() => {
    getTeamAction()
      .then((res) => {
        if (res.success && res.data) setTeamMembers(res.data.team);
      })
      .catch(() => {});
  }, []);

  const filterCounts = useMemo(() => {
    const counts: Record<ConversationStatus | "all", number> = {
      all: conversations.length,
      active: 0,
      waiting: 0,
      resolved: 0,
      archived: 0,
    };
    for (const c of conversations) {
      if (c.status in counts) {
        counts[c.status]++;
      }
    }
    return counts;
  }, [conversations]);

  const filteredConversations = useMemo(() => {
    let result = conversations;

    if (activeFilter !== "all") {
      result = result.filter((c) => c.status === activeFilter);
    }

    if (activeChannel !== "all") {
      result = result.filter((c) => (c.channel || "chat") === activeChannel);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.visitor.name.toLowerCase().includes(query) ||
          c.visitor.email.toLowerCase().includes(query) ||
          c.messages.some((m) => m.content.toLowerCase().includes(query))
      );
    }

    switch (sortBy) {
      case "recent":
        result = [...result].sort(
          (a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
        );
        break;
      case "oldest":
        result = [...result].sort(
          (a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
        );
        break;
      case "messages-most":
        result = [...result].sort((a, b) => b.messages.length - a.messages.length);
        break;
      case "messages-least":
        result = [...result].sort((a, b) => a.messages.length - b.messages.length);
        break;
    }

    return result;
  }, [conversations, activeFilter, activeChannel, searchQuery, sortBy]);

  const allSelected =
    filteredConversations.length > 0 &&
    filteredConversations.every((c) => selectedIds.has(c.id));

  const handleSelect = useCallback((id: string) => {
    router.push(`/dashboard/conversations/${id}`);
  }, [router]);

  const handleBulkSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredConversations.map((c) => c.id)));
    }
  }, [allSelected, filteredConversations]);

  const handleBulkResolve = useCallback(async () => {
    await bulkResolve(Array.from(selectedIds));
    setSelectedIds(new Set());
  }, [selectedIds, bulkResolve]);

  const handleBulkAssign = useCallback(
    async (agentId: string) => {
      await bulkAssign(Array.from(selectedIds), agentId);
      setSelectedIds(new Set());
    },
    [selectedIds, bulkAssign]
  );

  const handleBulkArchive = useCallback(async () => {
    await bulkArchive(Array.from(selectedIds));
    setSelectedIds(new Set());
  }, [selectedIds, bulkArchive]);

  const handleBulkDelete = useCallback(async () => {
    await bulkDelete(Array.from(selectedIds));
    setSelectedIds(new Set());
    if (selectedId && selectedIds.has(selectedId)) {
      router.push("/dashboard/conversations");
    }
  }, [selectedIds, selectedId, bulkDelete, router]);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2.5">
            <h1 className="text-3xl font-bold tracking-tight">Conversations</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full">
              {filterCounts.all} total
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1.5">
            Manage visitor interactions and chat sessions
          </p>
        </div>
        <ConversationFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          activeChannel={activeChannel}
          onChannelChange={setActiveChannel}
        />
      </div>

      <div className="flex flex-1 overflow-hidden rounded-lg border border-border/40">
        <div className="w-[32%] min-w-[300px] max-w-[380px] shrink-0">
          <ConversationList
            conversations={filteredConversations}
            selectedId={selectedId}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onBulkSelect={handleBulkSelect}
            onSelectAll={handleSelectAll}
            allSelected={allSelected}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            filterCounts={filterCounts}
            loading={loading}
          />
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </div>
      </div>

      <BulkActions
        selectedCount={selectedIds.size}
        teamMembers={teamMembers}
        onResolve={handleBulkResolve}
        onAssign={handleBulkAssign}
        onArchive={handleBulkArchive}
        onDelete={handleBulkDelete}
      />
    </>
  );
}
