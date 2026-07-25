export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  category: string;
  tags: string[];
  images: string[];
  url?: string;
  storeId?: number;
  stock: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  productCount: number;
}

export type ProductStatus = "active" | "draft" | "archived";

export type ViewMode = "table" | "grid";

export type SortField = "name" | "price" | "stock" | "createdAt";
export type SortDirection = "asc" | "desc";

export interface ProductFilters {
  search: string;
  category: string;
  status: ProductStatus | "all";
  sortField: SortField;
  sortDirection: SortDirection;
  page: number;
  pageSize: number;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  sku: string;
  category: string;
  tags: string[];
  images: string[];
  stock: number;
  status: ProductStatus;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
}
