"use client";

import { Check, UserPlus, Archive, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockTeamMembers } from "@/lib/mock-data/agents";

interface BulkActionsProps {
  selectedCount: number;
  onResolve: () => void;
  onAssign: (agentId: string) => void;
  onArchive: () => void;
  onDelete: () => void;
}

export function BulkActions({
  selectedCount,
  onResolve,
  onAssign,
  onArchive,
  onDelete,
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2 border-t border-border/40 bg-muted/50 p-3">
      <span className="text-sm font-medium">{selectedCount} selected</span>
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={onResolve}
        >
          <Check className="h-4 w-4" />
          Resolve
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Assign
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {mockTeamMembers.map((agent) => (
              <DropdownMenuItem
                key={agent.id}
                onClick={() => onAssign(agent.id)}
              >
                {agent.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={onArchive}
        >
          <Archive className="h-4 w-4" />
          Archive
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}
