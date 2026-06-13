"use client";

import { MessageSquare } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Conversation, ConversationStatus } from "@/types/conversation";
import { formatRelativeTime } from "@/lib/time-utils";

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
}

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-chart-1/20 text-chart-1 border-chart-1/30";
    case "resolved":
      return "bg-chart-2/20 text-chart-2 border-chart-2/30";
    case "waiting":
      return "bg-chart-4/20 text-chart-4 border-chart-4/30";
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
}: ConversationListProps) {
  const filters: { label: string; value: ConversationStatus | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Waiting", value: "waiting" },
    { label: "Resolved", value: "resolved" },
  ];

  return (
    <div className="flex h-full flex-col border-r border-border/40">
      <div className="border-b border-border/40 p-4">
        <div className="flex gap-1">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              variant={activeFilter === filter.value ? "default" : "ghost"}
              size="sm"
              className="text-xs"
              onClick={() => onFilterChange(filter.value)}
            >
              {filter.label}
              <span className="ml-1 text-xs opacity-70">
                {filterCounts[filter.value]}
              </span>
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-border/40 px-4 py-2">
        <Checkbox
          checked={allSelected}
          onCheckedChange={onSelectAll}
          aria-label="Select all"
        />
        <span className="text-xs text-muted-foreground">Select all</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
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
                  "flex w-full items-start gap-3 border-b border-border/40 p-4 text-left transition-colors hover:bg-muted/50",
                  selectedId === conversation.id && "bg-muted/50",
                  hasUnread && "bg-primary/5"
                )}
              >
                <div
                  className="mt-1"
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
                <Avatar className="h-9 w-9 flex-shrink-0">
                  <AvatarFallback className="text-xs">
                    {conversation.visitor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-sm font-medium">
                      {conversation.visitor.name}
                    </span>
                    <span className="flex-shrink-0 text-xs text-muted-foreground">
                      {formatRelativeTime(conversation.lastActivity)}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] px-1.5 py-0",
                        getStatusColor(conversation.status)
                      )}
                    >
                      {conversation.status}
                    </Badge>
                    <span className="truncate text-xs text-muted-foreground">
                      {lastMessage?.content || "No messages"}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageSquare className="h-3 w-3" />
                    {conversation.messages.length} messages
                    {hasUnread && (
                      <span className="ml-2 h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
