"use client";

import { Search, SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ConversationFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  totalCount: number;
}

export function ConversationFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
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
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-[160px]">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">Most Recent</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="messages-most">Most Messages</SelectItem>
          <SelectItem value="messages-least">Least Messages</SelectItem>
        </SelectContent>
      </Select>
      <span className="text-sm text-muted-foreground">
        {totalCount} conversations
      </span>
    </div>
  );
}
