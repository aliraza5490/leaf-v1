export type KBSourceType = "manual" | "document" | "url" | "product-sync";
export type KBStatus = "active" | "draft" | "archived";
export type KBContentType = "article" | "faq";
export type KBViewMode = "table" | "grid";
export type KBSortField = "title" | "createdAt" | "updatedAt";
export type KBSortDirection = "asc" | "desc";

export interface KBArticle {
  id: string;
  title: string;
  content: string;
  contentType: KBContentType;
  category: string;
  tags: string[];
  status: KBStatus;
  source: KBSourceType;
  sourceUrl?: string;
  sourceFile?: string;
  linkedProducts: string[];
  faqQuestion?: string;
  faqAnswer?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KBCategory {
  id: string;
  name: string;
  description: string;
  articleCount: number;
}

export interface KBFilters {
  search: string;
  category: string;
  contentType: KBContentType | "all";
  source: KBSourceType | "all";
  status: KBStatus | "all";
  sortField: KBSortField;
  sortDirection: KBSortDirection;
}

export interface KBArticleFormData {
  title: string;
  content: string;
  contentType: KBContentType;
  category: string;
  tags: string[];
  status: KBStatus;
  source: KBSourceType;
  sourceUrl?: string;
  linkedProducts: string[];
  faqQuestion?: string;
  faqAnswer?: string;
}

export interface KBFAQFormData {
  faqQuestion: string;
  faqAnswer: string;
  category: string;
  tags: string[];
  status: KBStatus;
}

export interface KBImportPreview {
  data: KBArticleFormData[];
  errors: string[][];
}
