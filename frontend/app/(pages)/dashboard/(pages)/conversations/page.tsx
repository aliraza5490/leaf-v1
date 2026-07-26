import { MessageSquare, Sparkles, Keyboard } from "lucide-react";
import { getConversationStatsAction } from "@/app/actions/conversations";

export const dynamic = "force-dynamic";

export default async function ConversationsPage() {
  const statsRes = await getConversationStatsAction();
  const stats = statsRes.success ? statsRes.data ?? null : null;

  return (
    <div className="flex h-full items-center justify-center p-4 bg-muted/5 overflow-hidden">
      <div className="max-w-[340px] w-full p-5 rounded-xl border border-border/40 bg-background/50 backdrop-blur-md shadow-lg flex flex-col items-center text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Animated Icon Illustration */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-125 animate-pulse" />
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-tr from-primary to-chart-1 text-primary-foreground shadow-sm border border-primary/20">
            <MessageSquare className="h-5.5 w-5.5 text-white" />
            <Sparkles className="absolute -top-1 -right-1 h-3.5 w-3.5 text-yellow-400 fill-yellow-400 animate-bounce" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-0.5">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">No conversation selected</h2>
          <p className="text-[11px] text-muted-foreground max-w-[260px] mx-auto leading-normal">
            Select a session from the list on the left to start responding, view visitor diagnostics, or read AI summaries.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="w-full space-y-1.5">
          <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider text-left">
            Current Stats
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-1.5 rounded-lg border border-border/40 bg-muted/5 flex flex-col items-center justify-center">
              <span className="text-[8px] font-medium text-muted-foreground uppercase">Active</span>
              <span className="text-xs font-bold text-foreground mt-0.5">{stats?.active ?? 0}</span>
            </div>
            <div className="p-1.5 rounded-lg border border-border/40 bg-muted/5 flex flex-col items-center justify-center">
              <span className="text-[8px] font-medium text-muted-foreground uppercase">Waiting</span>
              <span className="text-xs font-bold text-chart-4 mt-0.5">{stats?.waiting ?? 0}</span>
            </div>
            <div className="p-1.5 rounded-lg border border-border/40 bg-muted/5 flex flex-col items-center justify-center">
              <span className="text-[8px] font-medium text-muted-foreground uppercase">Resolved</span>
              <span className="text-xs font-bold text-chart-2 mt-0.5">{stats?.resolved ?? 0}</span>
            </div>
          </div>
        </div>

        {/* What you can do list */}
        <div className="w-full space-y-1.5 bg-muted/5 p-2.5 rounded-lg border border-border/20 text-left">
          <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">
            Select a conversation to view:
          </div>
          <ul className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-foreground/80 font-normal leading-tight">
            <li className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-primary" />
              Chat & audio history
            </li>
            <li className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-primary" />
              Visitor info
            </li>
            <li className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-primary" />
              AI summary card
            </li>
            <li className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-primary" />
              Notes & tags
            </li>
          </ul>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground bg-muted/20 px-2 py-1 rounded-lg border border-border/10 justify-center w-full">
          <Keyboard className="h-3 w-3 shrink-0" />
          <span>Press <kbd className="bg-muted px-1 py-0.2 rounded text-[8px] font-mono border border-border/40 shadow-sm text-foreground font-semibold">/</kbd> to search</span>
        </div>

      </div>
    </div>
  );
}
