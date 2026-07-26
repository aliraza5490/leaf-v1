"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { getAccessToken } from "@/lib/auth/service";

export function useAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAccessToken().then((token) => {
      setIsAuthenticated(!!token);
      setIsLoading(false);
    });
  }, []);

  async function logout() {
    await logoutAction();
    setIsAuthenticated(false);
    router.push("/auth/login");
  }

  return { isAuthenticated, isLoading, logout };
}
