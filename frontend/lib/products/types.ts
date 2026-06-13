export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  category: string;
  tags: string[];
  images: string[];
  stock: number;
  status: "active" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  productCount: number;
}

export type ProductStatus = Product["status"];

export type ViewMode = "table" | "grid";

export type SortField = "name" | "price" | "stock" | "createdAt";
export type SortDirection = "asc" | "desc";

export interface ProductFilters {
  search: string;
  category: string;
  status: ProductStatus | "all";
  sortField: SortField;
  sortDirection: SortDirection;
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
