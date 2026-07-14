"use client";

import { MoreHorizontal, CheckCircle2, UserPlus, FileDown, FileText, File } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Conversation } from "@/types/conversation";
import type { TeamMember } from "@/lib/conversations/types";
import { exportAsText, exportAsPDF, exportAsWord } from "@/lib/export-utils";
import { cn } from "@/lib/utils";
import { getAvatarGradient } from "./conversation-list";

interface VisitorHeaderProps {
  conversation: Conversation;
  teamMembers: TeamMember[];
  onResolve: () => void;
  onAssign: (agentId: string) => void;
}

export function VisitorHeader({ conversation, teamMembers, onResolve, onAssign }: VisitorHeaderProps) {
  return (
    <div className="border-b border-border/40 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className={cn("text-xs font-semibold shadow-sm border", getAvatarGradient(conversation.visitor.name))}>
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
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <FileDown className="mr-2 h-4 w-4" />
                  Export
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => exportAsPDF(conversation)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportAsText(conversation)}>
                    <File className="mr-2 h-4 w-4" />
                    Export as Text
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportAsWord(conversation)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export as Word
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem onClick={onResolve}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Resolve
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Assign
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {teamMembers.map((agent) => (
                    <DropdownMenuItem
                      key={agent.id}
                      onClick={() => onAssign(agent.id)}
                    >
                      {agent.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View visitor profile</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Delete conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
