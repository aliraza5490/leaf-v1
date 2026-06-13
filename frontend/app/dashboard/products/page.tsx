"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ProductsHeader } from "@/components/dashboard/products/products-header";
import { ProductsToolbar } from "@/components/dashboard/products/products-toolbar";
import { ProductsTable } from "@/components/dashboard/products/products-table";
import { ProductsGrid } from "@/components/dashboard/products/products-grid";
import { ProductFormDialog } from "@/components/dashboard/products/product-form-dialog";
import { ProductImportDialog } from "@/components/dashboard/products/product-import-dialog";
import type {
  Product,
  ProductFilters,
  ProductFormData,
  ViewMode,
} from "@/lib/products/types";
import { mockProducts } from "@/lib/products/mock-data";
import { generateId } from "@/lib/products/utils";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    category: "all",
    status: "all",
    sortField: "createdAt",
    sortDirection: "desc",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.sku.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.tags.some((t) => t.toLowerCase().includes(search))
      );
    }

    if (filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters.status !== "all") {
      result = result.filter((p) => p.status === filters.status);
    }

    result.sort((a, b) => {
      const direction = filters.sortDirection === "asc" ? 1 : -1;
      switch (filters.sortField) {
        case "name":
          return a.name.localeCompare(b.name) * direction;
        case "price":
          return (a.price - b.price) * direction;
        case "stock":
          return (a.stock - b.stock) * direction;
        case "createdAt":
          return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * direction;
        default:
          return 0;
      }
    });

    return result;
  }, [products, filters]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    toast.success(`"${product.name}" has been deleted.`);
  };

  const handleSaveProduct = (data: ProductFormData) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                ...data,
                updatedAt: new Date().toISOString(),
              }
            : p
        )
      );
      toast.success(`"${data.name}" has been updated.`);
    } else {
      const newProduct: Product = {
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProducts((prev) => [newProduct, ...prev]);
      toast.success(`"${data.name}" has been added.`);
    }
  };

  const handleImportProducts = (importedProducts: ProductFormData[]) => {
    const newProducts: Product[] = importedProducts.map((data) => ({
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    setProducts((prev) => [...newProducts, ...prev]);
    toast.success(`${importedProducts.length} products have been imported.`);
  };

  return (
    <div className="flex flex-col gap-6">
      <ProductsHeader onAddProduct={handleAddProduct} onImport={() => setImportOpen(true)} />

      <ProductsToolbar
        filters={filters}
        onFiltersChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {viewMode === "table" ? (
        <ProductsTable
          products={filteredProducts}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      ) : (
        <ProductsGrid
          products={filteredProducts}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      )}

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editingProduct}
        onSave={handleSaveProduct}
      />

      <ProductImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImport={handleImportProducts}
      />
    </div>
  );
}
