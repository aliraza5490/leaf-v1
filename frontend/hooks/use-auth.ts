"use client";

import { useEffect, useState } from "react";
import { getAccessToken, removeAccessToken } from "@/lib/auth/service";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(!!getAccessToken());
    setIsLoading(false);
  }, []);

  function logout() {
    removeAccessToken();
    setIsAuthenticated(false);
  }

  return { isAuthenticated, isLoading, logout };
}
