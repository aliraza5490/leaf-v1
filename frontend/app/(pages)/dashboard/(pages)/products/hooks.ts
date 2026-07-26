import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  listProductsAction,
  createProductAction,
  updateProductAction,
  deleteProductAction,
  bulkImportProductsAction,
  listCategoriesAction,
} from "@/app/actions/products";
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
    queryFn: async () => {
      const res = await listProductsAction(params);
      if (!res.success) throw new Error(res.error || "Failed to load products");
      return res.data;
    },
  });

  const categoriesQuery = useQuery({
    queryKey: ["productCategories"],
    queryFn: async () => {
      const res = await listCategoriesAction();
      if (!res.success) throw new Error(res.error || "Failed to load categories");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["productCategories"] });
  }, [queryClient]);

  const createMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const res = await createProductAction(data);
      if (!res.success) throw new Error(res.error || "Failed to create product");
      return res.data;
    },
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
    mutationFn: async ({ id, data }: { id: string; data: ProductFormData }) => {
      const res = await updateProductAction(id, data);
      if (!res.success) throw new Error(res.error || "Failed to update product");
      return res.data;
    },
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
    mutationFn: async (product: Product) => {
      const res = await deleteProductAction(product.id);
      if (!res.success) throw new Error(res.error || "Failed to delete product");
      return res.data;
    },
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
    mutationFn: async (items: ProductFormData[]) => {
      const res = await bulkImportProductsAction(items);
      if (!res.success) throw new Error(res.error || "Failed to import products");
      return res.data;
    },
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
