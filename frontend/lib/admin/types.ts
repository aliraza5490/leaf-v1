export type UserRole = "superadmin" | "admin" | "user";

export interface AdminUser {
  email: string;
  full_name: string | null;
  store_id: string;
  role: UserRole;
  isActive: boolean;
}

export interface AdminUserUpdate {
  full_name?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface Store {
  id: string;
  name: string;
  owner_email: string | null;
  status: "active" | "suspended" | "trial";
  plan: "free" | "starter" | "pro" | "enterprise";
  created_at: string;
  updated_at: string;
  user_count?: number;
  product_count?: number;
  conversation_count?: number;
}

export interface StoreUpdate {
  name?: string;
  status?: "active" | "suspended" | "trial";
  plan?: "free" | "starter" | "pro" | "enterprise";
}

export interface SystemSetting {
  key: string;
  value: string;
  description: string;
  updated_at: string;
}

export interface SystemSettingUpdate {
  value?: string;
  description?: string;
}

export interface PlatformOverview {
  total_users: number;
  total_stores: number;
  total_products: number;
  total_conversations: number;
  total_messages: number;
  active_stores: number;
}

export interface UserStats {
  total: number;
  active: number;
  by_role: {
    superadmin: number;
    admin: number;
    user: number;
  };
  new_last_30_days: number;
}

export interface StoreStats {
  total: number;
  by_status: {
    active: number;
    suspended: number;
    trial: number;
  };
  by_plan: {
    free: number;
    starter: number;
    pro: number;
    enterprise: number;
  };
}

export interface TrendDataPoint {
  date: string;
  stores: number;
  conversations: number;
}

export interface TrendsResponse {
  range_days: number;
  daily: TrendDataPoint[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}
