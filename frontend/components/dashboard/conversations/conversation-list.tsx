"use client";

import { useEffect } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Conversation, ConversationStatus } from "@/types/conversation";
import { formatRelativeTime } from "@/lib/time-utils";
import { getInitials, getAvatarGradient } from "@/lib/avatar-utils";

export { getInitials, getAvatarGradient };

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  selectedIds: Set<string>;
  onSelect: (id: string) => void;
  onBulkSelect: (id: string) => void;
  onSelectAll: () => void;
  allSelected: boolean;
  activeFilter: ConversationStatus | "all";
  onFilterChange: (filter: ConversationStatus | "all") => void;
  filterCounts: Record<ConversationStatus | "all", number>;
  loading?: boolean;
}

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-chart-1/10 text-chart-1 border-chart-1/30";
    case "resolved":
      return "bg-chart-2/10 text-chart-2 border-chart-2/30";
    case "waiting":
      return "bg-chart-4/10 text-chart-4 border-chart-4/30";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function ConversationList({
  conversations,
  selectedId,
  selectedIds,
  onSelect,
  onBulkSelect,
  onSelectAll,
  allSelected,
  activeFilter,
  onFilterChange,
  filterCounts,
  loading = false,
}: ConversationListProps) {
  const filters: { label: string; value: ConversationStatus | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Waiting", value: "waiting" },
    { label: "Resolved", value: "resolved" },
  ];

  // Hotkey listener: '/' to focus search in header, J/K to navigate list
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search
      if (
        e.key === "/" && 
        document.activeElement?.tagName !== "INPUT" && 
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        const searchInput = document.getElementById("search-conversations-input") as HTMLInputElement;
        searchInput?.focus();
        return;
      }

      // J/K Navigation
      if (
        (e.key === "j" || e.key === "k") &&
        document.activeElement?.tagName !== "INPUT" && 
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        const currentIndex = conversations.findIndex(c => c.id === selectedId);
        if (e.key === "j") {
          const nextIndex = currentIndex + 1;
          if (nextIndex < conversations.length) {
            onSelect(conversations[nextIndex].id);
          }
        } else if (e.key === "k") {
          const prevIndex = currentIndex - 1;
          if (prevIndex >= 0) {
            onSelect(conversations[prevIndex].id);
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [conversations, selectedId, onSelect]);

  return (
    <div className="flex h-full flex-col border-r border-border/40 bg-background">
      {/* Tabs / Segmented Control */}
      <div className="border-b border-border/40 p-3 bg-muted/20">
        <div className="flex p-1 bg-muted/60 rounded-lg gap-1 border border-border/10">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.value;
            return (
              <button
                key={filter.value}
                onClick={() => onFilterChange(filter.value)}
                className={cn(
                  "flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all text-center flex items-center justify-center gap-1.5",
                  isActive
                    ? "bg-background text-foreground shadow-md font-bold border border-border/10 scale-[1.02]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                <span>{filter.label}</span>
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded text-[10px] min-w-[16px] text-center font-bold",
                    isActive
                      ? "bg-muted text-foreground"
                      : "bg-muted/40 text-muted-foreground"
                  )}
                >
                  {filterCounts[filter.value]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bulk Select Header */}
      <div className="flex items-center gap-2 border-b border-border/40 px-4 py-2 bg-muted/5">
        <Checkbox
          checked={allSelected}
          onCheckedChange={onSelectAll}
          aria-label="Select all"
        />
        <span className="text-[11px] font-medium text-muted-foreground">Select all conversations</span>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/20">
        {loading && conversations.length === 0 ? (
          <div className="space-y-0.5">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex items-start gap-3 p-4 border-b border-border/10 animate-pulse">
                <div className="h-4 w-4 rounded bg-muted/60 mt-1.5" />
                <div className="h-9 w-9 rounded-full bg-muted/60" />
                <div className="grow space-y-2">
                  <div className="h-4 w-1/3 rounded bg-muted/60" />
                  <div className="h-3 w-1/2 rounded bg-muted/60" />
                  <div className="h-3 w-full rounded bg-muted/40" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex h-full items-center justify-center p-8">
            <p className="text-sm text-muted-foreground">
              No conversations found
            </p>
          </div>
        ) : (
          conversations.map((conversation) => {
            const hasUnread = conversation.messages.some(
              (m) => !m.read && m.sender !== "visitor"
            );
            const lastMessage =
              conversation.messages[conversation.messages.length - 1];
            const isSelected = selectedId === conversation.id;

            return (
              <div
                key={conversation.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(conversation.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(conversation.id);
                  }
                }}
                className={cn(
                  "flex w-full items-start gap-3 border-b border-border/40 p-4 text-left transition-all duration-200 hover:scale-[1.01] hover:bg-muted/30 relative",
                  isSelected 
                    ? "bg-accent/50 pl-3 border-l-4 border-l-teal-600 dark:border-l-teal-400 shadow-sm" 
                    : "pl-4",
                  hasUnread && "bg-primary/5"
                )}
              >
                <div
                  className="mt-1.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBulkSelect(conversation.id);
                  }}
                >
                  <Checkbox
                    checked={selectedIds.has(conversation.id)}
                    aria-label={`Select ${conversation.visitor.name}`}
                  />
                </div>
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className={cn("text-xs font-semibold shadow-sm border", getAvatarGradient(conversation.visitor.name))}>
                    {getInitials(conversation.visitor.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  {/* Visitor Name & Unread Dot */}
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-foreground flex items-center gap-1.5">
                      {conversation.visitor.name}
                      {hasUnread && (
                        <span className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.6)]" />
                      )}
                    </span>
                  </div>

                  {/* Scannable Metadata Rows */}
                  <div className="mt-1 flex flex-col gap-0.5 text-[11px] text-muted-foreground/80 font-medium">
                    <div className="flex items-center justify-between">
                      <span className="capitalize text-foreground/90">{conversation.channel || "chat"}</span>
                      <span className="text-[10px] text-muted-foreground/75 font-normal">
                        Last active {formatRelativeTime(conversation.lastActivity)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-normal">{conversation.messages.length} messages</span>
                      {conversation.status !== "active" && (
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[8px] h-4 px-1 py-0 font-bold uppercase tracking-wider",
                            getStatusColor(conversation.status)
                          )}
                        >
                          {conversation.status}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Two Line Preview */}
                  <p className="mt-2 text-xs text-muted-foreground/75 font-normal line-clamp-2 leading-relaxed wrap-break-word">
                    {lastMessage?.content || "No messages"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
