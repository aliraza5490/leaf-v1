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
import type { ProductFilters, ProductStatus, SortField, ViewMode } from "@/lib/products/types";
import { categories } from "@/lib/products/mock-data";

interface ProductsToolbarProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ProductsToolbar({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
}: ProductsToolbarProps) {
  const updateFilter = <K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={filters.category}
          onValueChange={(value) => updateFilter("category", value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.status}
          onValueChange={(value) => updateFilter("status", value as ProductStatus | "all")}
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
            const [field, direction] = value.split("-") as [SortField, "asc" | "desc"];
            onFiltersChange({ ...filters, sortField: field, sortDirection: direction });
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="price-asc">Price (Low-High)</SelectItem>
            <SelectItem value="price-desc">Price (High-Low)</SelectItem>
            <SelectItem value="stock-asc">Stock (Low-High)</SelectItem>
            <SelectItem value="stock-desc">Stock (High-Low)</SelectItem>
            <SelectItem value="createdAt-desc">Newest First</SelectItem>
            <SelectItem value="createdAt-asc">Oldest First</SelectItem>
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
