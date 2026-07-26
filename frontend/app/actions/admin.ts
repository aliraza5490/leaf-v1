"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import {
  getAdminUsers,
  getAdminUserStats,
  getAdminUser,
  updateAdminUser,
  deactivateAdminUser,
  getAdminStores,
  getAdminStoreStats,
  getAdminStore,
  updateAdminStore,
  getAdminOverview,
  getAdminTrends,
  getAdminTopStores,
  getAdminSettings,
  createAdminSetting,
  updateAdminSetting,
  deleteAdminSetting,
} from "@/lib/api/admin";
import type { ActionResponse } from "@/app/actions/auth";
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

const adminUserUpdateSchema = z.object({
  role: z.enum(["user", "admin", "superadmin"]).optional(),
  is_active: z.boolean().optional(),
  full_name: z.string().optional(),
});

const adminStoreUpdateSchema = z.object({
  name: z.string().optional(),
  domain: z.string().optional(),
  status: z.enum(["active", "suspended", "pending"]).optional(),
  plan: z.enum(["free", "starter", "pro", "enterprise"]).optional(),
});

const adminSettingCreateSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
  description: z.string().default(""),
});

const adminSettingUpdateSchema = z.object({
  value: z.string().optional(),
  description: z.string().optional(),
});

export async function getAdminUsersAction(params?: {
  q?: string;
  role?: string;
  is_active?: boolean;
  page?: number;
  page_size?: number;
}): Promise<ActionResponse<PaginatedResponse<AdminUser>>> {
  try {
    const res = await getAdminUsers(params);
    return { success: true, data: res };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to fetch admin users" };
  }
}

export async function getAdminUserStatsAction(): Promise<ActionResponse<UserStats>> {
  try {
    const res = await getAdminUserStats();
    return { success: true, data: res };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to fetch user stats" };
  }
}

export async function updateAdminUserAction(
  email: string,
  data: AdminUserUpdate
): Promise<ActionResponse<AdminUser>> {
  const result = adminUserUpdateSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: "Validation failed", fieldErrors: result.error.flatten().fieldErrors };
  }
  try {
    const res = await updateAdminUser(email, result.data as AdminUserUpdate);
    revalidatePath("/admin/users");
    return { success: true, data: res };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update user" };
  }
}

export async function deactivateAdminUserAction(
  email: string
): Promise<ActionResponse<{ message: string }>> {
  if (!email) return { success: false, error: "Email is required" };
  try {
    const res = await deactivateAdminUser(email);
    revalidatePath("/admin/users");
    return { success: true, data: res };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to deactivate user" };
  }
}

export async function getAdminStoresAction(params?: {
  q?: string;
  status?: string;
  plan?: string;
  page?: number;
  page_size?: number;
}): Promise<ActionResponse<PaginatedResponse<Store>>> {
  try {
    const res = await getAdminStores(params);
    return { success: true, data: res };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to fetch admin stores" };
  }
}

export async function getAdminStoreStatsAction(): Promise<ActionResponse<StoreStats>> {
  try {
    const res = await getAdminStoreStats();
    return { success: true, data: res };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to fetch store stats" };
  }
}

export async function updateAdminStoreAction(
  id: number,
  data: StoreUpdate
): Promise<ActionResponse<Store>> {
  const result = adminStoreUpdateSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: "Validation failed", fieldErrors: result.error.flatten().fieldErrors };
  }
  try {
    const res = await updateAdminStore(id, result.data as StoreUpdate);
    revalidatePath("/admin/stores");
    return { success: true, data: res };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update store" };
  }
}

export async function getAdminOverviewAction(): Promise<ActionResponse<PlatformOverview>> {
  try {
    const res = await getAdminOverview();
    return { success: true, data: res };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to fetch platform overview" };
  }
}

export async function getAdminTrendsAction(rangeDays = 30): Promise<ActionResponse<AdminTrendsResponse>> {
  try {
    const res = await getAdminTrends(rangeDays);
    return { success: true, data: res };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to fetch admin trends" };
  }
}

export async function getAdminTopStoresAction(limit = 10): Promise<ActionResponse<{ items: Store[] }>> {
  try {
    const res = await getAdminTopStores(limit);
    return { success: true, data: res };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to fetch top stores" };
  }
}

export async function getAdminSettingsAction(): Promise<ActionResponse<SystemSetting[]>> {
  try {
    const res = await getAdminSettings();
    return { success: true, data: res };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to fetch admin settings" };
  }
}

export async function createAdminSettingAction(data: {
  key: string;
  value: string;
  description: string;
}): Promise<ActionResponse<SystemSetting>> {
  const result = adminSettingCreateSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: "Validation failed", fieldErrors: result.error.flatten().fieldErrors };
  }
  try {
    const res = await createAdminSetting(result.data);
    revalidatePath("/admin/settings");
    return { success: true, data: res };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to create setting" };
  }
}

export async function updateAdminSettingAction(
  key: string,
  data: SystemSettingUpdate
): Promise<ActionResponse<SystemSetting>> {
  const result = adminSettingUpdateSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: "Validation failed", fieldErrors: result.error.flatten().fieldErrors };
  }
  try {
    const res = await updateAdminSetting(key, result.data as SystemSettingUpdate);
    revalidatePath("/admin/settings");
    return { success: true, data: res };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update setting" };
  }
}

export async function deleteAdminSettingAction(
  key: string
): Promise<ActionResponse<{ message: string }>> {
  if (!key) return { success: false, error: "Key is required" };
  try {
    const res = await deleteAdminSetting(key);
    revalidatePath("/admin/settings");
    return { success: true, data: res };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete setting" };
  }
}
