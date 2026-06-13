"use client";

import { Globe, Clock, MousePointerClick } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Conversation } from "@/types/conversation";

interface VisitorHeaderProps {
  conversation: Conversation;
}

export function VisitorHeader({ conversation }: VisitorHeaderProps) {
  return (
    <div className="border-b border-border/40 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {conversation.visitor.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{conversation.visitor.name}</h2>
            <p className="text-sm text-muted-foreground">
              {conversation.visitor.email}
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className={
            conversation.status === "active"
              ? "bg-chart-1/20 text-chart-1 border-chart-1/30"
              : conversation.status === "waiting"
                ? "bg-chart-4/20 text-chart-4 border-chart-4/30"
                : "bg-chart-2/20 text-chart-2 border-chart-2/30"
          }
        >
          {conversation.status}
        </Badge>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {conversation.metadata.sessionDuration} session
        </span>
        <span className="flex items-center gap-1">
          <MousePointerClick className="h-3 w-3" />
          {conversation.metadata.pagesVisited} pages visited
        </span>
        <span className="flex items-center gap-1">
          <Globe className="h-3 w-3" />
          {conversation.metadata.source}
        </span>
      </div>
    </div>
  );
}
