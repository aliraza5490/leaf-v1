"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import { ConversationList } from "./conversation-list";
import { ConversationFilters } from "./conversation-filters";
import { BulkActions } from "./bulk-actions";
import { useConversations } from "@/hooks/use-conversations";
import { getTeam } from "@/lib/conversations/api";
import type { ConversationStatus } from "@/types/conversation";
import type { TeamMember } from "@/lib/conversations/types";

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
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const {
    conversations,
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
    getTeam()
      .then((data) => setTeamMembers(data.team))
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
  }, [conversations, activeFilter, searchQuery, sortBy]);

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
          <h1 className="text-3xl font-bold tracking-tight">Conversations</h1>
          <p className="text-muted-foreground">
            Manage visitor interactions and chat sessions
          </p>
        </div>
        <ConversationFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalCount={filterCounts[activeFilter]}
        />
      </div>

      <div className="flex flex-1 overflow-hidden rounded-lg border border-border/40">
        <div className="w-[400px] flex-shrink-0">
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
          />
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {selectedId ? (
            children
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-medium">No conversation selected</p>
                <p className="text-sm text-muted-foreground">
                  Select a conversation from the list to view details
                </p>
              </div>
            </div>
          )}
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
