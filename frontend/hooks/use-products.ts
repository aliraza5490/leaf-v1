"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  listProducts,
  createProduct as apiCreate,
  updateProduct as apiUpdate,
  deleteProduct as apiDelete,
  bulkImportProducts,
  listCategories,
} from "@/lib/products/api";
import type {
  Product,
  ProductFormData,
  ProductFilters,
  Category,
} from "@/lib/products/types";

export function useProducts(filters: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mutating, setMutating] = useState(false);

  const seqRef = useRef(0);

  useEffect(() => {
    const seq = ++seqRef.current;

    const params = {
      q: filters.search || undefined,
      category: filters.category && filters.category !== "all" ? filters.category : undefined,
      status: filters.status !== "all" ? filters.status : undefined,
      sort_field: filters.sortField,
      sort_dir: filters.sortDirection,
      page: filters.page,
      page_size: filters.pageSize,
    };

    const timer = setTimeout(() => {
      setLoading(true);
      listProducts(params)
        .then((data) => {
          if (seq !== seqRef.current) return;
          setProducts(data.products);
          setTotal(data.total);
          setError(null);
        })
        .catch((err: unknown) => {
          if (seq !== seqRef.current) return;
          const message = err instanceof Error ? err.message : "Failed to load products";
          setError(message);
        })
        .finally(() => {
          if (seq === seqRef.current) setLoading(false);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [
    filters.search,
    filters.category,
    filters.status,
    filters.sortField,
    filters.sortDirection,
    filters.page,
    filters.pageSize,
  ]);

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch(() => {
        // Categories are non-critical; silently ignore.
      });
  }, []);

  const refetch = useCallback(() => {
    seqRef.current++;
    setLoading(true);
    const params = {
      q: filters.search || undefined,
      category: filters.category && filters.category !== "all" ? filters.category : undefined,
      status: filters.status !== "all" ? filters.status : undefined,
      sort_field: filters.sortField,
      sort_dir: filters.sortDirection,
      page: filters.page,
      page_size: filters.pageSize,
    };
    listProducts(params)
      .then((data) => {
        setProducts(data.products);
        setTotal(data.total);
        setError(null);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Failed to load products";
        setError(message);
      })
      .finally(() => setLoading(false));
  }, [
    filters.search,
    filters.category,
    filters.status,
    filters.sortField,
    filters.sortDirection,
    filters.page,
    filters.pageSize,
  ]);

  const createProduct = useCallback(
    async (data: ProductFormData) => {
      setMutating(true);
      try {
        await apiCreate(data);
        toast.success(`"${data.name}" has been added.`);
        refetch();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to create product";
        toast.error(message);
        throw err;
      } finally {
        setMutating(false);
      }
    },
    [refetch]
  );

  const updateProduct = useCallback(
    async (id: string, data: ProductFormData) => {
      setMutating(true);
      try {
        await apiUpdate(id, data);
        toast.success(`"${data.name}" has been updated.`);
        refetch();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to update product";
        toast.error(message);
        throw err;
      } finally {
        setMutating(false);
      }
    },
    [refetch]
  );

  const removeProduct = useCallback(
    async (product: Product) => {
      setMutating(true);
      try {
        await apiDelete(product.id);
        toast.success(`"${product.name}" has been deleted.`);
        refetch();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to delete product";
        toast.error(message);
        throw err;
      } finally {
        setMutating(false);
      }
    },
    [refetch]
  );

  const importProducts = useCallback(
    async (items: ProductFormData[]) => {
      setMutating(true);
      try {
        await bulkImportProducts(items);
        toast.success(`${items.length} products have been imported.`);
        refetch();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to import products";
        toast.error(message);
        throw err;
      } finally {
        setMutating(false);
      }
    },
    [refetch]
  );

  return {
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
    refetch,
  };
}
