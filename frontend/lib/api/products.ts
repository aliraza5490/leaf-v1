import { serverApiGet, serverApiPost, serverApiPut, serverApiDelete } from "@/lib/api/server";
import type {
  Product,
  ProductFormData,
  ProductListResponse,
  Category,
} from "@/types";

interface BackendProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  url: string;
  category: string;
  tags: string[];
  store_id: number;
  sku: string;
  stock: number;
  status: Product["status"];
  created_at: string;
  updated_at: string;
}

interface BackendProductListResponse {
  products: BackendProduct[];
  total: number;
  page: number;
  page_size: number;
}

interface BackendBulkResponse {
  products: BackendProduct[];
  count: number;
}

interface BackendCategory {
  id: string;
  name: string;
  productCount: number;
}

interface BackendCategoriesResponse {
  categories: BackendCategory[];
}

interface BackendDeleteResponse {
  product_id: number;
}

export interface ProductQueryParams {
  q?: string;
  category?: string;
  status?: string;
  sort_field?: string;
  sort_dir?: string;
  page?: number;
  page_size?: number;
  [key: string]: string | number | undefined;
}

function toProduct(p: BackendProduct): Product {
  return {
    id: String(p.id),
    name: p.name,
    description: p.description,
    price: p.price,
    sku: p.sku,
    category: p.category,
    tags: p.tags ?? [],
    images: p.images ?? [],
    url: p.url,
    storeId: p.store_id,
    stock: p.stock,
    status: p.status,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

function toCreatePayload(data: ProductFormData): Record<string, unknown> {
  return {
    name: data.name,
    description: data.description,
    price: data.price,
    sku: data.sku,
    category: data.category,
    tags: data.tags.join(","),
    images: JSON.stringify(data.images),
    stock: data.stock,
    status: data.status,
  };
}

function toUpdatePayload(data: ProductFormData): Record<string, unknown> {
  return toCreatePayload(data);
}

export async function listProducts(
  params: ProductQueryParams
): Promise<ProductListResponse> {
  const data = await serverApiGet<BackendProductListResponse>("/products/", params);
  return {
    products: data.products.map(toProduct),
    total: data.total,
    page: data.page,
    pageSize: data.page_size,
  };
}

export async function createProduct(
  data: ProductFormData
): Promise<Product> {
  const product = await serverApiPost<BackendProduct>("/products/", toCreatePayload(data));
  return toProduct(product);
}

export async function updateProduct(
  id: string,
  data: ProductFormData
): Promise<Product> {
  const product = await serverApiPut<BackendProduct>(
    `/products/${id}`,
    toUpdatePayload(data)
  );
  return toProduct(product);
}

export async function deleteProduct(id: string): Promise<void> {
  await serverApiDelete<BackendDeleteResponse>(`/products/${id}`);
}

export async function bulkImportProducts(
  items: ProductFormData[]
): Promise<Product[]> {
  const data = await serverApiPost<BackendBulkResponse>("/products/bulk", {
    products: items.map(toCreatePayload),
  });
  return data.products.map(toProduct);
}

export async function listCategories(): Promise<Category[]> {
  const data = await serverApiGet<BackendCategoriesResponse>("/products/categories");
  return data.categories.map((c) => ({
    id: c.id,
    name: c.name,
    productCount: c.productCount,
  }));
}
