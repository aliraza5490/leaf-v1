"use client";

import { LayoutGrid, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TeamFilters, TeamMemberRole, TeamMemberStatus, TeamSortField, ViewMode } from "@/lib/team/types";

interface TeamToolbarProps {
  filters: TeamFilters;
  onFiltersChange: (filters: TeamFilters) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function TeamToolbar({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
}: TeamToolbarProps) {
  const updateFilter = <K extends keyof TeamFilters>(
    key: K,
    value: TeamFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={filters.role}
          onValueChange={(value) => updateFilter("role", value as TeamMemberRole | "all")}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="agent">Agent</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.status}
          onValueChange={(value) => updateFilter("status", value as TeamMemberStatus | "all")}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="invited">Invited</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={`${filters.sortField}-${filters.sortDirection}`}
          onValueChange={(value) => {
            const [field, direction] = value.split("-") as [TeamSortField, "asc" | "desc"];
            onFiltersChange({ ...filters, sortField: field, sortDirection: direction });
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="role-asc">Role (A-Z)</SelectItem>
            <SelectItem value="joinedAt-desc">Newest First</SelectItem>
            <SelectItem value="joinedAt-asc">Oldest First</SelectItem>
            <SelectItem value="lastActive-desc">Recently Active</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-1 rounded-lg border bg-muted p-1">
        <Button
          variant={viewMode === "table" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("table")}
          className="h-8 px-3"
        >
          <List className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:ml-2">Table</span>
        </Button>
        <Button
          variant={viewMode === "grid" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => onViewModeChange("grid")}
          className="h-8 px-3"
        >
          <LayoutGrid className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:ml-2">Grid</span>
        </Button>
      </div>
    </div>
  );
}
