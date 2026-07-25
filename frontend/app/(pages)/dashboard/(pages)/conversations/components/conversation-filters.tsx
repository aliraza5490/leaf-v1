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
import type { ConversationChannel } from "@/app/(pages)/dashboard/(pages)/conversations/types";

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
}

export function ConversationFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  activeChannel,
  onChannelChange,
}: ConversationFiltersProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Search Bar */}
      <div className="relative flex-1 min-w-[280px] max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />
        <Input
          id="search-conversations-input"
          placeholder="Search conversations... (Press '/')"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-background border border-border/30 h-8 text-xs focus-visible:bg-background"
        />
      </div>

      {/* Channel Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs border border-border/30">
            <MessagesSquare className="h-3.5 w-3.5 text-muted-foreground" />
            {channelLabels[activeChannel]}
            <ChevronDown className="h-3 w-3 opacity-50 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuLabel className="text-xs">Channel</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={activeChannel}
            onValueChange={(v) => onChannelChange(v as ChannelFilter)}
          >
            <DropdownMenuRadioItem value="all" className="text-xs">All Channels</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="chat" className="text-xs">Text Only</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="voice" className="text-xs">Voice Only</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Sort Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs border border-border/30">
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
            {sortLabels[sortBy] || "Sort by"}
            <ChevronDown className="h-3 w-3 opacity-50 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuLabel className="text-xs">Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={sortBy} onValueChange={onSortChange}>
            <DropdownMenuRadioItem value="recent" className="text-xs">Most Recent</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="oldest" className="text-xs">Oldest First</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="messages-most" className="text-xs">Most Messages</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="messages-least" className="text-xs">Least Messages</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
