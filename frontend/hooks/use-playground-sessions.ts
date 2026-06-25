"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  PlaygroundSession,
  PlaygroundMode,
  PlaygroundMessage,
  VoiceEntry,
  BotConfig,
} from "@/lib/playground/types";
import { DEFAULT_BOT_CONFIG } from "@/lib/playground/types";

const STORAGE_KEY = "playground_sessions";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadSessions(): PlaygroundSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: PlaygroundSession[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function usePlaygroundSessions() {
  const [sessions, setSessions] = useState<PlaygroundSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  useEffect(() => {
    const loaded = loadSessions();
    setSessions(loaded);
    if (loaded.length > 0) {
      setActiveSessionId(loaded[0].id);
    }
  }, []);

  const activeSession =
    sessions.find((s) => s.id === activeSessionId) ?? null;

  const createSession = useCallback(
    (mode: PlaygroundMode) => {
      const now = new Date().toISOString();
      const session: PlaygroundSession = {
        id: generateId(),
        title: `New ${mode} session`,
        mode,
        messages: [],
        voiceEntries: [],
        config: { ...DEFAULT_BOT_CONFIG },
        createdAt: now,
        updatedAt: now,
      };
      setSessions((prev) => {
        const next = [session, ...prev];
        saveSessions(next);
        return next;
      });
      setActiveSessionId(session.id);
      return session;
    },
    []
  );

  const deleteSession = useCallback(
    (id: string) => {
      setSessions((prev) => {
        const next = prev.filter((s) => s.id !== id);
        saveSessions(next);
        return next;
      });
      if (activeSessionId === id) {
        setActiveSessionId((prev) => {
          const remaining = sessions.filter((s) => s.id !== id);
          return remaining.length > 0 ? remaining[0].id : null;
        });
      }
    },
    [activeSessionId, sessions]
  );

  const addMessage = useCallback(
    (sessionId: string, message: PlaygroundMessage) => {
      setSessions((prev) => {
        const next = prev.map((s) => {
          if (s.id !== sessionId) return s;
          const messages = [...s.messages, message];
          const title =
            s.messages.length === 0 && message.role === "user"
              ? message.content.slice(0, 40) + (message.content.length > 40 ? "..." : "")
              : s.title;
          return { ...s, messages, title, updatedAt: new Date().toISOString() };
        });
        saveSessions(next);
        return next;
      });
    },
    []
  );

  const addVoiceEntry = useCallback(
    (sessionId: string, entry: VoiceEntry) => {
      setSessions((prev) => {
        const next = prev.map((s) => {
          if (s.id !== sessionId) return s;
          const voiceEntries = [...s.voiceEntries, entry];
          const title =
            s.voiceEntries.length === 0 && entry.role === "user"
              ? entry.transcript.slice(0, 40) + (entry.transcript.length > 40 ? "..." : "")
              : s.title;
          return { ...s, voiceEntries, title, updatedAt: new Date().toISOString() };
        });
        saveSessions(next);
        return next;
      });
    },
    []
  );

  const updateConfig = useCallback(
    (sessionId: string, config: Partial<BotConfig>) => {
      setSessions((prev) => {
        const next = prev.map((s) => {
          if (s.id !== sessionId) return s;
          return {
            ...s,
            config: { ...s.config, ...config },
            updatedAt: new Date().toISOString(),
          };
        });
        saveSessions(next);
        return next;
      });
    },
    []
  );

  const clearHistory = useCallback(() => {
    setSessions([]);
    setActiveSessionId(null);
    saveSessions([]);
  }, []);

  return {
    sessions,
    activeSession,
    activeSessionId,
    setActiveSessionId,
    createSession,
    deleteSession,
    addMessage,
    addVoiceEntry,
    updateConfig,
    clearHistory,
  };
}
