"use client";

import { useState, useMemo, useCallback } from "react";

import { ConversationList } from "@/components/dashboard/conversations/conversation-list";
import { ConversationDetail } from "@/components/dashboard/conversations/conversation-detail";
import { ConversationFilters } from "@/components/dashboard/conversations/conversation-filters";
import { BulkActions } from "@/components/dashboard/conversations/bulk-actions";
import { mockConversations } from "@/lib/mock-data/conversations";
import type { Conversation, ConversationStatus, Message } from "@/types/conversation";

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [activeFilter, setActiveFilter] = useState<ConversationStatus | "all">("all");

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  const filterCounts = useMemo(() => {
    const counts: Record<ConversationStatus | "all", number> = {
      all: conversations.length,
      active: 0,
      waiting: 0,
      resolved: 0,
      archived: 0,
    };
    for (const c of conversations) {
      counts[c.status]++;
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
          (a, b) =>
            new Date(b.lastActivity).getTime() -
            new Date(a.lastActivity).getTime()
        );
        break;
      case "oldest":
        result = [...result].sort(
          (a, b) =>
            new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
        );
        break;
      case "messages-most":
        result = [...result].sort(
          (a, b) => b.messages.length - a.messages.length
        );
        break;
      case "messages-least":
        result = [...result].sort(
          (a, b) => a.messages.length - b.messages.length
        );
        break;
    }

    return result;
  }, [conversations, activeFilter, searchQuery, sortBy]);

  const allSelected =
    filteredConversations.length > 0 &&
    filteredConversations.every((c) => selectedIds.has(c.id));

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

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

  const handleSendReply = useCallback(
    (message: string) => {
      if (!selectedId) return;
      const newMessage: Message = {
        id: `m-${Date.now()}`,
        sender: "agent",
        content: message,
        timestamp: new Date().toISOString(),
        read: true,
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedId
            ? {
                ...c,
                messages: [...c.messages, newMessage],
                lastActivity: new Date().toISOString(),
              }
            : c
        )
      );
    },
    [selectedId]
  );

  const handleQuickReply = useCallback(
    (text: string) => {
      if (!selectedId) return;
      const newMessage: Message = {
        id: `m-${Date.now()}`,
        sender: "agent",
        content: text,
        timestamp: new Date().toISOString(),
        read: true,
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedId
            ? {
                ...c,
                messages: [...c.messages, newMessage],
                lastActivity: new Date().toISOString(),
              }
            : c
        )
      );
    },
    [selectedId]
  );

  const handleResolve = useCallback(() => {
    if (!selectedId) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId ? { ...c, status: "resolved" as const } : c
      )
    );
  }, [selectedId]);

  const handleBulkResolve = useCallback(() => {
    setConversations((prev) =>
      prev.map((c) =>
        selectedIds.has(c.id) ? { ...c, status: "resolved" as const } : c
      )
    );
    setSelectedIds(new Set());
  }, [selectedIds]);

  const handleAssign = useCallback(
    (agentId: string) => {
      if (!selectedId) return;
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedId ? { ...c, assignedTo: agentId } : c
        )
      );
    },
    [selectedId]
  );

  const handleBulkAssign = useCallback(
    (agentId: string) => {
      setConversations((prev) =>
        prev.map((c) =>
          selectedIds.has(c.id) ? { ...c, assignedTo: agentId } : c
        )
      );
      setSelectedIds(new Set());
    },
    [selectedIds]
  );

  const handleBulkArchive = useCallback(() => {
    setConversations((prev) =>
      prev.map((c) =>
        selectedIds.has(c.id) ? { ...c, status: "archived" as const } : c
      )
    );
    setSelectedIds(new Set());
  }, [selectedIds]);

  const handleBulkDelete = useCallback(() => {
    setConversations((prev) =>
      prev.filter((c) => !selectedIds.has(c.id))
    );
    setSelectedIds(new Set());
    if (selectedId && selectedIds.has(selectedId)) {
      setSelectedId(null);
    }
  }, [selectedIds, selectedId]);

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
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
        <div className="flex-1">
          {selectedConversation ? (
            <ConversationDetail
              conversation={selectedConversation}
              onSendReply={handleSendReply}
              onQuickReply={handleQuickReply}
              onResolve={handleResolve}
              onAssign={handleAssign}
            />
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
        onResolve={handleBulkResolve}
        onAssign={handleBulkAssign}
        onArchive={handleBulkArchive}
        onDelete={handleBulkDelete}
      />
    </div>
  );
}
