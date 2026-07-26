"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import {
  listProducts,
  createProduct as apiCreateProduct,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  bulkImportProducts,
  listCategories,
} from "@/lib/api/products";
import type { ActionResponse } from "@/app/actions/auth";
import type { ProductListResponse, Product, ProductFormData } from "@/app/(pages)/dashboard/(pages)/products/types";

const productQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  sort_field: z.string().optional(),
  sort_dir: z.string().optional(),
  page: z.number().optional(),
  page_size: z.number().optional(),
});

const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.number().min(0, "Price must be at least 0"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["active", "draft", "archived"]).optional(),
  description: z.string().optional(),
  sku: z.string().optional(),
  stock: z.number().optional(),
  image_url: z.string().optional(),
});

const bulkImportSchema = z.array(productFormSchema).min(1, "At least one product is required for import");

export async function listProductsAction(
  params: Record<string, unknown> = {}
): Promise<ActionResponse<ProductListResponse>> {
  const result = productQuerySchema.safeParse(params);
  if (!result.success) {
    return { success: false, error: "Invalid product query parameters" };
  }
  try {
    const res = await listProducts(result.data);
    return { success: true, data: res };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to fetch products",
    };
  }
}

export async function createProductAction(
  input: ProductFormData
): Promise<ActionResponse<Product>> {
  const result = productFormSchema.safeParse(input);
  if (!result.success) {
    return {
      success: false,
      error: "Validation error",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }
  try {
    const res = await apiCreateProduct(result.data as ProductFormData);
    revalidatePath("/dashboard/products");
    return { success: true, data: res };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create product",
    };
  }
}

export async function updateProductAction(
  id: string,
  input: ProductFormData
): Promise<ActionResponse<Product>> {
  if (!id) return { success: false, error: "Product ID is required" };
  const result = productFormSchema.safeParse(input);
  if (!result.success) {
    return {
      success: false,
      error: "Validation error",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }
  try {
    const res = await apiUpdateProduct(id, result.data as ProductFormData);
    revalidatePath("/dashboard/products");
    return { success: true, data: res };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update product",
    };
  }
}

export async function deleteProductAction(
  id: string
): Promise<ActionResponse<void>> {
  if (!id) return { success: false, error: "Product ID is required" };
  try {
    await apiDeleteProduct(id);
    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete product",
    };
  }
}

export async function bulkImportProductsAction(
  items: ProductFormData[]
): Promise<ActionResponse<Product[]>> {
  const result = bulkImportSchema.safeParse(items);
  if (!result.success) {
    return {
      success: false,
      error: "Validation error in bulk import items",
    };
  }
  try {
    const res = await bulkImportProducts(result.data as ProductFormData[]);
    revalidatePath("/dashboard/products");
    return { success: true, data: res };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to import products",
    };
  }
}

export async function listCategoriesAction(): Promise<ActionResponse<import("@/types").Category[]>> {
  try {
    const res = await listCategories();
    return { success: true, data: res };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to fetch categories",
    };
  }
}
