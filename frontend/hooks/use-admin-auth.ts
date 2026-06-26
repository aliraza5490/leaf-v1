"use client";
import { useCallback, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, removeAccessToken } from "@/lib/auth/service";
import type { UserRole } from "@/lib/admin/types";

interface AdminUser {
  email: string;
  role: UserRole;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
}

// Cache last snapshot value and the token it was derived from.
// useSyncExternalStore requires getSnapshot to return the same reference
// when the underlying data hasn't changed, otherwise React detects an
// infinite loop (new object !== new object on every call).
let cachedToken: string | null = undefined as unknown as null;
let cachedUser: AdminUser | null = null;

function getSnapshot(): AdminUser | null {
  const token = getAccessToken();

  // Return cached reference when the token hasn't changed
  if (token === cachedToken) return cachedUser;

  cachedToken = token;

  if (!token) {
    cachedUser = null;
    return null;
  }

  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.email !== "string") {
    cachedUser = null;
    return null;
  }

  cachedUser = {
    email: payload.email,
    role: (payload.role as UserRole) || "user",
  };

  return cachedUser;
}

function getServerSnapshot(): AdminUser | null {
  return null;
}

let listeners: Array<() => void> = [];

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function notifyListeners() {
  listeners.forEach((l) => l());
}

export function useAdminAuth() {
  const router = useRouter();
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const isSuperAdmin = user?.role === "superadmin";
  const isLoading = false;

  const logout = useCallback(() => {
    removeAccessToken();
    notifyListeners();
    router.push("/auth/login");
  }, [router]);

  return { user, isAdmin, isSuperAdmin, isLoading, logout };
}