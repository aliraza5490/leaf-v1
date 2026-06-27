"use client";

import { Search, SlidersHorizontal, MessagesSquare, ChevronDown } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ConversationChannel } from "@/types/conversation";

type ChannelFilter = "all" | ConversationChannel;

const channelLabels: Record<ChannelFilter, string> = {
  all: "All Channels",
  chat: "Text Only",
  voice: "Voice Only",
};

const sortLabels: Record<string, string> = {
  recent: "Most Recent",
  oldest: "Oldest First",
  "messages-most": "Most Messages",
  "messages-least": "Least Messages",
};

interface ConversationFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  activeChannel: ChannelFilter;
  onChannelChange: (channel: ChannelFilter) => void;
  totalCount: number;
}

export function ConversationFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  activeChannel,
  onChannelChange,
  totalCount,
}: ConversationFiltersProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <MessagesSquare className="h-4 w-4" />
            {channelLabels[activeChannel]}
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Channel</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={activeChannel}
            onValueChange={(v) => onChannelChange(v as ChannelFilter)}
          >
            <DropdownMenuRadioItem value="all">All Channels</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="chat">Text Only</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="voice">Voice Only</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5">
            <SlidersHorizontal className="h-4 w-4" />
            {sortLabels[sortBy] || "Sort by"}
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={sortBy} onValueChange={onSortChange}>
            <DropdownMenuRadioItem value="recent">Most Recent</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="oldest">Oldest First</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="messages-most">Most Messages</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="messages-least">Least Messages</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <span className="text-sm text-muted-foreground whitespace-nowrap">
        {totalCount} conversations
      </span>
    </div>
  );
}
