"use client";

import { useState } from "react";
import { AlertCircle, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductsHeader } from "@/app/(pages)/dashboard/(pages)/products/components/products-header";
import { ProductsToolbar } from "@/app/(pages)/dashboard/(pages)/products/components/products-toolbar";
import { ProductsTable } from "@/app/(pages)/dashboard/(pages)/products/components/products-table";
import { ProductsGrid } from "@/app/(pages)/dashboard/(pages)/products/components/products-grid";
import { ProductFormDialog } from "@/app/(pages)/dashboard/(pages)/products/components/product-form-dialog";
import { ProductImportDialog } from "@/app/(pages)/dashboard/(pages)/products/components/product-import-dialog";
import { useProducts } from "@/app/(pages)/dashboard/(pages)/products/hooks";
import type {
  Product,
  ProductFilters,
  ProductFormData,
  ViewMode,
} from "@/app/(pages)/dashboard/(pages)/products/types";

const DEFAULT_FILTERS: ProductFilters = {
  search: "",
  category: "all",
  status: "all",
  sortField: "createdAt",
  sortDirection: "desc",
  page: 1,
  pageSize: 20,
};

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);

  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const {
    products,
    total,
    categories,
    loading,
    error,
    mutating,
    createProduct,
    updateProduct,
    removeProduct,
    importProducts,
  } = useProducts(filters);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    removeProduct(product);
  };

  const handleSaveProduct = async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
      } else {
        await createProduct(data);
      }
      setFormOpen(false);
    } catch {
      // Error toast handled in hook; keep dialog open on failure.
    }
  };

  const handleImportProducts = async (items: ProductFormData[]) => {
    try {
      await importProducts(items);
      setImportOpen(false);
    } catch {
      // Error toast handled in hook; keep dialog open on failure.
    }
  };

  return (
    <div className="flex flex-col gap-6 min-w-0 w-full">
      <ProductsHeader onAddProduct={handleAddProduct} onImport={() => setImportOpen(true)} />

      <ProductsToolbar
        filters={filters}
        onFiltersChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        categories={categories}
        total={total}
        loading={loading}
      />

      {error ? (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium">Failed to load products</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      ) : loading ? (
        <ProductsSkeleton viewMode={viewMode} />
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-12 text-center">
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm text-muted-foreground">
            Get started by adding a product or importing a catalog.
          </p>
          <div className="mt-2 flex gap-2">
            <Button variant="outline" onClick={() => setImportOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button onClick={handleAddProduct}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>
      ) : viewMode === "table" ? (
        <ProductsTable
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      ) : (
        <ProductsGrid
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      )}

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editingProduct}
        onSave={handleSaveProduct}
        categories={categories}
        saving={mutating}
      />

      <ProductImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImport={handleImportProducts}
        importing={mutating}
      />
    </div>
  );
}

function ProductsSkeleton({ viewMode }: { viewMode: ViewMode }) {
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-2 p-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-8 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="rounded-md border">
      <div className="space-y-4 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
