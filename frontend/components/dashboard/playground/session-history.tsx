"use client";

import { useState } from "react";
import { Plus, Search, MessageSquare, Mic, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { PlaygroundSession, PlaygroundMode } from "@/lib/playground/types";

interface SessionHistoryProps {
  sessions: PlaygroundSession[];
  activeSessionId: string | null;
  activeMode: PlaygroundMode;
  onSelect: (id: string) => void;
  onNew: (mode: PlaygroundMode) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

function formatRelative(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export function SessionHistory({
  sessions,
  activeSessionId,
  activeMode,
  onSelect,
  onNew,
  onDelete,
  onClear,
}: SessionHistoryProps) {
  const [search, setSearch] = useState("");

  const filtered = sessions
    .filter((s) => s.mode === activeMode)
    .filter(
      (s) =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.messages.some((m) =>
          m.content.toLowerCase().includes(search.toLowerCase())
        )
    );

  return (
    <div className="flex h-full flex-col border-r border-border/40">
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
        <h3 className="text-sm font-semibold">Sessions</h3>
        <div className="flex items-center gap-1">
          {sessions.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={onClear}
              title="Clear all history"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={() => onNew(activeMode)}
          >
            <Plus className="h-3.5 w-3.5" />
            New
          </Button>
        </div>
      </div>

      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search sessions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 px-2 pb-2">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                {activeMode === "text" ? (
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Mic className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {search ? "No matching sessions" : "No sessions yet"}
              </p>
              {!search && (
                <Button
                  variant="link"
                  size="sm"
                  className="text-xs h-auto mt-1"
                  onClick={() => onNew(activeMode)}
                >
                  Start a new session
                </Button>
              )}
            </div>
          )}
          {filtered.map((session) => {
            const msgCount =
              session.mode === "text"
                ? session.messages.length
                : session.voiceEntries.length;
            return (
              <div
                key={session.id}
                onClick={() => onSelect(session.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(session.id);
                  }
                }}
                role="button"
                tabIndex={0}
                className={cn(
                  "group flex w-full flex-col gap-1 rounded-lg px-3 py-2.5 text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  activeSessionId === session.id
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted/50 border border-transparent"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={cn(
                      "text-sm font-medium truncate",
                      activeSessionId === session.id
                        ? "text-primary"
                        : "text-foreground"
                    )}
                  >
                    {session.title}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(session.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>{formatRelative(session.updatedAt)}</span>
                  <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/50" />
                  <span>
                    {msgCount} {msgCount === 1 ? "message" : "messages"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
