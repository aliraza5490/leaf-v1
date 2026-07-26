import { Skeleton } from "@/components/ui/skeleton";

export default function ConversationLoading() {
  return (
    <div className="flex h-full min-h-0 flex-row overflow-hidden flex-1 animate-in fade-in-50 duration-300">
      {/* Main Chat Area Skeleton */}
      <div className="flex flex-1 flex-col min-h-0 overflow-hidden border-r border-border/40">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between border-b border-border/40 p-4 bg-background/50">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16 rounded-full" />
              </div>
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>

        {/* Chat Messages Skeleton */}
        <div className="flex-1 p-4 space-y-4 overflow-hidden">
          {/* Visitor message (left) */}
          <div className="flex items-start gap-3 max-w-[80%]">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-16 w-3/4 rounded-2xl rounded-tl-sm" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

          {/* Agent message (right) */}
          <div className="flex items-start justify-end gap-3 ml-auto max-w-[80%]">
            <div className="space-y-2 flex-1 flex flex-col items-end">
              <Skeleton className="h-12 w-2/3 rounded-2xl rounded-tr-sm" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          </div>

          {/* Visitor message (left) */}
          <div className="flex items-start gap-3 max-w-[80%]">
            <Skeleton className="h-8 w-8 rounded-full shrink-0 text-left" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-20 w-4/5 rounded-2xl rounded-tl-sm" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Metadata Sidebar Skeleton */}
      <div className="w-[38%] min-w-[250px] max-w-[320px] shrink-0 flex flex-col bg-muted/10 overflow-y-auto border-l border-border/10">
        {/* Visitor Profile Skeleton */}
        <div className="p-4 border-b border-border/40 space-y-3">
          <Skeleton className="h-3 w-24" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
        </div>

        {/* AI Summary Skeleton */}
        <div className="p-4 border-b border-border/40 space-y-3 bg-primary/2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="p-3 rounded-xl border border-border/20 space-y-2 bg-background/60">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-4/6" />
          </div>
        </div>

        {/* Details List Skeleton */}
        <div className="p-4 border-b border-border/40 space-y-3">
          <Skeleton className="h-3 w-24" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-28" />
              </div>
            ))}
          </div>
        </div>

        {/* Tags Section Skeleton */}
        <div className="p-4 border-b border-border/40 space-y-3">
          <Skeleton className="h-3 w-16" />
          <div className="flex flex-wrap gap-1.5">
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-14 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
