"use client";

import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BotConfigHeaderProps {
  hasChanges: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export function BotConfigHeader({ hasChanges, onSave, onCancel }: BotConfigHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Bot Configuration</h1>
          <p className="text-muted-foreground">
            Configure your AI bot&apos;s behavior, model settings, and guardrails
          </p>
        </div>
      </div>
      {hasChanges && (
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Changes</Button>
        </div>
      )}
    </div>
  );
}
