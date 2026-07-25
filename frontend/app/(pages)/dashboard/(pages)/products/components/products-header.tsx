"use client";

import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductsHeaderProps {
  onAddProduct: () => void;
  onImport: () => void;
}

export function ProductsHeader({ onAddProduct, onImport }: ProductsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">
          Manage your product catalog and inventory.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onImport}>
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>
        <Button onClick={onAddProduct}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
    </div>
  );
}
