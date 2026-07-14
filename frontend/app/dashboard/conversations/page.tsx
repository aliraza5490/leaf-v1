"use client";

import { MessageSquare, Sparkles, Keyboard } from "lucide-react";
import { useConversationStats } from "@/hooks/use-conversation-stats";

export default function ConversationsPage() {
  const { stats, loading } = useConversationStats();

  return (
    <div className="flex h-full items-center justify-center p-6 bg-muted/5 overflow-hidden">
      <div className="max-w-md w-full p-6 rounded-2xl border border-border/40 bg-background/50 backdrop-blur-md shadow-xl flex flex-col items-center text-center space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Animated Icon Illustration */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-125 animate-pulse" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-tr from-primary to-chart-1 text-primary-foreground shadow-md border border-primary/20">
            <MessageSquare className="h-7 w-7 text-white" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 fill-yellow-400 animate-bounce" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-1">
          <h2 className="text-lg font-bold tracking-tight text-foreground">No conversation selected</h2>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Select a session from the list on the left to start responding, view visitor diagnostics, or read AI summaries.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="w-full space-y-2">
          <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider text-left">
            Current Stats
          </div>
          {loading ? (
            <div className="grid grid-cols-3 gap-2.5">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-12 rounded-xl bg-muted/40 animate-pulse border border-border/10" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-2.5 rounded-xl border border-border/40 bg-muted/10 flex flex-col items-center justify-center">
                <span className="text-[9px] font-medium text-muted-foreground uppercase">Active</span>
                <span className="text-base font-bold text-foreground mt-0.5">{stats?.active ?? 0}</span>
              </div>
              <div className="p-2.5 rounded-xl border border-border/40 bg-muted/10 flex flex-col items-center justify-center">
                <span className="text-[9px] font-medium text-muted-foreground uppercase">Waiting</span>
                <span className="text-base font-bold text-chart-4 mt-0.5">{stats?.waiting ?? 0}</span>
              </div>
              <div className="p-2.5 rounded-xl border border-border/40 bg-muted/10 flex flex-col items-center justify-center">
                <span className="text-[9px] font-medium text-muted-foreground uppercase">Resolved</span>
                <span className="text-base font-bold text-chart-2 mt-0.5">{stats?.resolved ?? 0}</span>
              </div>
            </div>
          )}
        </div>

        {/* What you can do list */}
        <div className="w-full space-y-2 bg-muted/5 p-3 rounded-xl border border-border/20 text-left">
          <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
            Select a conversation to view:
          </div>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-foreground/80 font-normal">
            <li className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-primary" />
              Chat & audio history
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-primary" />
              Visitor information
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-primary" />
              AI summary card
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-primary" />
              Notes & tags
            </li>
          </ul>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/20 px-2.5 py-1.5 rounded-lg border border-border/10 justify-center w-full">
          <Keyboard className="h-3.5 w-3.5" />
          <span>Press <kbd className="bg-muted px-1 py-0.2 rounded text-[9px] font-mono border border-border/40 shadow-sm text-foreground font-semibold">/</kbd> to quickly search conversations</span>
        </div>

      </div>
    </div>
  );
}
