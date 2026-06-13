"use client";

import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  accentColors,
  baseColors,
  DEFAULT_ACCENT,
  DEFAULT_BASE,
} from "@/lib/theme-colors";

const ACCENT_STORAGE_KEY = "leaf-accent-color";
const BASE_STORAGE_KEY = "leaf-base-color";

function applyColorVars(vars: Record<string, string>) {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
}

function clearColorVars(keys: string[]) {
  const root = document.documentElement;
  for (const key of keys) {
    root.style.removeProperty(key);
  }
}

function getStoredAccent(): string {
  if (typeof window === "undefined") return DEFAULT_ACCENT;
  const stored = localStorage.getItem(ACCENT_STORAGE_KEY);
  return stored && accentColors.find((a) => a.id === stored)
    ? stored
    : DEFAULT_ACCENT;
}

function getStoredBase(): string {
  if (typeof window === "undefined") return DEFAULT_BASE;
  const stored = localStorage.getItem(BASE_STORAGE_KEY);
  return stored && baseColors.find((b) => b.id === stored)
    ? stored
    : DEFAULT_BASE;
}

export function useThemeColor() {
  const { resolvedTheme } = useTheme();
  const [accentColor, setAccentColorState] = useState(getStoredAccent);
  const [baseColor, setBaseColorState] = useState(getStoredBase);

  const applyColors = useCallback(
    (accentId: string, baseId: string, theme?: string) => {
      const accent = accentColors.find((a) => a.id === accentId);
      const base = baseColors.find((b) => b.id === baseId);
      if (!accent || !base) return;

      const isDark = theme === "dark";
      applyColorVars(isDark ? accent.dark : accent.light);
      applyColorVars(isDark ? base.dark : base.light);
    },
    []
  );

  useEffect(() => {
    if (!resolvedTheme) return;
    applyColors(accentColor, baseColor, resolvedTheme);
  }, [resolvedTheme, accentColor, baseColor, applyColors]);

  const setAccentColor = useCallback(
    (id: string) => {
      setAccentColorState(id);
      localStorage.setItem(ACCENT_STORAGE_KEY, id);
    },
    []
  );

  const setBaseColor = useCallback(
    (id: string) => {
      setBaseColorState(id);
      localStorage.setItem(BASE_STORAGE_KEY, id);
    },
    []
  );

  const resetColors = useCallback(() => {
    const accentKeys = Object.keys(accentColors[0].light);
    const baseKeys = Object.keys(baseColors[0].light);
    clearColorVars([...accentKeys, ...baseKeys]);
    setAccentColorState(DEFAULT_ACCENT);
    setBaseColorState(DEFAULT_BASE);
    localStorage.removeItem(ACCENT_STORAGE_KEY);
    localStorage.removeItem(BASE_STORAGE_KEY);
  }, []);

  return {
    accentColor,
    baseColor,
    setAccentColor,
    setBaseColor,
    resetColors,
  };
}
