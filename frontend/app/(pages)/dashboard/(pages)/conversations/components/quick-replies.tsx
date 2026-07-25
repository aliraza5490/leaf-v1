"use client";

import { Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { quickReplies } from "@/lib/mock-data/quick-replies";

interface QuickRepliesProps {
  onSelect: (text: string) => void;
}

export function QuickReplies({ onSelect }: QuickRepliesProps) {
  return (
    <div className="border-t border-border/40 p-3">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">
          Quick Replies
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {quickReplies.map((reply) => (
          <Button
            key={reply.id}
            variant="outline"
            size="sm"
            className="flex-shrink-0 text-xs h-7 px-3"
            onClick={() => onSelect(reply.text)}
          >
            {reply.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
