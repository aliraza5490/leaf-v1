import { serverApiGet, serverApiPost, serverApiPut, serverApiDelete } from "@/lib/api/server";
import type {
  AdminUser,
  AdminUserUpdate,
  Store,
  StoreUpdate,
  SystemSetting,
  SystemSettingUpdate,
  PlatformOverview,
  UserStats,
  StoreStats,
  AdminTrendsResponse,
  PaginatedResponse,
} from "@/types";

export async function getAdminUsers(params?: {
  q?: string;
  role?: string;
  is_active?: boolean;
  page?: number;
  page_size?: number;
}): Promise<PaginatedResponse<AdminUser>> {
  return serverApiGet("/admin/users", params as Record<string, unknown>);
}

export async function getAdminUserStats(): Promise<UserStats> {
  return serverApiGet("/admin/users/stats");
}

export async function getAdminUser(email: string): Promise<AdminUser> {
  return serverApiGet(`/admin/users/${encodeURIComponent(email)}`);
}

export async function updateAdminUser(
  email: string,
  data: AdminUserUpdate
): Promise<AdminUser> {
  return serverApiPut(`/admin/users/${encodeURIComponent(email)}`, data);
}

export async function deactivateAdminUser(email: string): Promise<{ message: string }> {
  return serverApiDelete(`/admin/users/${encodeURIComponent(email)}`);
}

export async function getAdminStores(params?: {
  q?: string;
  status?: string;
  plan?: string;
  page?: number;
  page_size?: number;
}): Promise<PaginatedResponse<Store>> {
  return serverApiGet("/admin/stores", params as Record<string, unknown>);
}

export async function getAdminStoreStats(): Promise<StoreStats> {
  return serverApiGet("/admin/stores/stats");
}

export async function getAdminStore(id: number): Promise<Store> {
  return serverApiGet(`/admin/stores/${encodeURIComponent(String(id))}`);
}

export async function updateAdminStore(
  id: number,
  data: StoreUpdate
): Promise<Store> {
  return serverApiPut(`/admin/stores/${encodeURIComponent(String(id))}`, data);
}

export async function getAdminOverview(): Promise<PlatformOverview> {
  return serverApiGet("/admin/analytics/overview");
}

export async function getAdminTrends(rangeDays = 30): Promise<AdminTrendsResponse> {
  return serverApiGet("/admin/analytics/trends", { range_days: rangeDays });
}

export async function getAdminTopStores(limit = 10): Promise<{ items: Store[] }> {
  return serverApiGet("/admin/analytics/top-stores", { limit });
}

export async function getAdminSettings(): Promise<SystemSetting[]> {
  return serverApiGet("/admin/settings");
}

export async function createAdminSetting(data: {
  key: string;
  value: string;
  description: string;
}): Promise<SystemSetting> {
  return serverApiPost("/admin/settings", data);
}

export async function updateAdminSetting(
  key: string,
  data: SystemSettingUpdate
): Promise<SystemSetting> {
  return serverApiPut(`/admin/settings/${encodeURIComponent(key)}`, data);
}

export async function deleteAdminSetting(
  key: string
): Promise<{ message: string }> {
  return serverApiDelete(`/admin/settings/${encodeURIComponent(key)}`);
}
