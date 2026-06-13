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
import type {
  KBContentType,
  KBFilters,
  KBSortField,
  KBSourceType,
  KBStatus,
  KBViewMode,
} from "@/lib/knowledge-base/types";
import { kbCategories } from "@/lib/knowledge-base/mock-data";

interface KBToolbarProps {
  filters: KBFilters;
  onFiltersChange: (filters: KBFilters) => void;
  viewMode: KBViewMode;
  onViewModeChange: (mode: KBViewMode) => void;
}

export function KBToolbar({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
}: KBToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search knowledge base..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="pl-9"
          />
        </div>
        <Select
          value={filters.category}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, category: value })
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {kbCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.contentType}
          onValueChange={(value: KBContentType | "all") =>
            onFiltersChange({ ...filters, contentType: value })
          }
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="article">Articles</SelectItem>
            <SelectItem value="faq">FAQs</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.source}
          onValueChange={(value: KBSourceType | "all") =>
            onFiltersChange({ ...filters, source: value })
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="document">Document</SelectItem>
            <SelectItem value="url">URL</SelectItem>
            <SelectItem value="product-sync">Product Sync</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.status}
          onValueChange={(value: KBStatus | "all") =>
            onFiltersChange({ ...filters, status: value })
          }
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={`${filters.sortField}-${filters.sortDirection}`}
          onValueChange={(value) => {
            const [sortField, sortDirection] = value.split("-") as [
              KBSortField,
              "asc" | "desc",
            ];
            onFiltersChange({ ...filters, sortField, sortDirection });
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updatedAt-desc">Recently Updated</SelectItem>
            <SelectItem value="updatedAt-asc">Oldest Updated</SelectItem>
            <SelectItem value="createdAt-desc">Newest First</SelectItem>
            <SelectItem value="createdAt-asc">Oldest First</SelectItem>
            <SelectItem value="title-asc">Title A-Z</SelectItem>
            <SelectItem value="title-desc">Title Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant={viewMode === "table" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => onViewModeChange("table")}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "grid" ? "secondary" : "ghost"}
          size="icon"
          onClick={() => onViewModeChange("grid")}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
