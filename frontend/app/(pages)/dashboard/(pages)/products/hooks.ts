"use client";

import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  listProducts,
  createProduct as apiCreate,
  updateProduct as apiUpdate,
  deleteProduct as apiDelete,
  bulkImportProducts,
  listCategories,
} from "@/lib/api/products";
import type {
  Product,
  ProductFormData,
  ProductFilters,
} from "@/app/(pages)/dashboard/(pages)/products/types";

export function useProducts(filters: ProductFilters) {
  const queryClient = useQueryClient();

  const params = {
    q: filters.search || undefined,
    category: filters.category && filters.category !== "all" ? filters.category : undefined,
    status: filters.status !== "all" ? filters.status : undefined,
    sort_field: filters.sortField,
    sort_dir: filters.sortDirection,
    page: filters.page,
    page_size: filters.pageSize,
  };

  const productsQuery = useQuery({
    queryKey: ["products", params],
    queryFn: () => listProducts(params),
  });

  const categoriesQuery = useQuery({
    queryKey: ["productCategories"],
    queryFn: listCategories,
    staleTime: 5 * 60 * 1000,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["productCategories"] });
  }, [queryClient]);

  const createMutation = useMutation({
    mutationFn: (data: ProductFormData) => apiCreate(data),
    onSuccess: (_, data) => {
      toast.success(`"${data.name}" has been added.`);
      invalidate();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to create product";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductFormData }) => apiUpdate(id, data),
    onSuccess: (_, { data }) => {
      toast.success(`"${data.name}" has been updated.`);
      invalidate();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to update product";
      toast.error(message);
    },
  });

  const removeMutation = useMutation({
    mutationFn: (product: Product) => apiDelete(product.id),
    onSuccess: (_, product) => {
      toast.success(`"${product.name}" has been deleted.`);
      invalidate();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to delete product";
      toast.error(message);
    },
  });

  const importMutation = useMutation({
    mutationFn: (items: ProductFormData[]) => bulkImportProducts(items),
    onSuccess: (_, items) => {
      toast.success(`${items.length} products have been imported.`);
      invalidate();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to import products";
      toast.error(message);
    },
  });

  const createProduct = useCallback(
    (data: ProductFormData) => createMutation.mutateAsync(data),
    [createMutation]
  );

  const updateProduct = useCallback(
    (id: string, data: ProductFormData) => updateMutation.mutateAsync({ id, data }),
    [updateMutation]
  );

  const removeProduct = useCallback(
    (product: Product) => removeMutation.mutateAsync(product),
    [removeMutation]
  );

  const importProducts = useCallback(
    (items: ProductFormData[]) => importMutation.mutateAsync(items),
    [importMutation]
  );

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    removeMutation.isPending ||
    importMutation.isPending;

  return {
    products: productsQuery.data?.products ?? [],
    total: productsQuery.data?.total ?? 0,
    categories: categoriesQuery.data ?? [],
    loading: productsQuery.isLoading,
    error: productsQuery.error ? (productsQuery.error instanceof Error ? productsQuery.error.message : "Failed to load products") : null,
    mutating: isMutating,
    createProduct,
    updateProduct,
    removeProduct,
    importProducts,
    refetch: productsQuery.refetch,
  };
}
