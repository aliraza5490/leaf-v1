"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, removeAccessToken } from "@/lib/auth/service";

export function useAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(!!getAccessToken());
    setIsLoading(false);
  }, []);

  function logout() {
    removeAccessToken();
    setIsAuthenticated(false);
    router.push("/auth/login");
  }

  return { isAuthenticated, isLoading, logout };
}
