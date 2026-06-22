"use client";

import { useEffect, useRef } from "react";
import { MoreHorizontal, CheckCircle2, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Conversation } from "@/types/conversation";
import { ChatMessage } from "./chat-message";
import { VisitorHeader } from "./visitor-header";
import { ReplyInput } from "./reply-input";
import { QuickReplies } from "./quick-replies";
import { ExportMenu } from "./export-menu";
import { mockTeamMembers } from "@/lib/mock-data/agents";

interface ConversationDetailProps {
  conversation: Conversation;
  onSendReply: (message: string) => void;
  onQuickReply: (text: string) => void;
  onResolve: () => void;
  onAssign: (agentId: string) => void;
}

export function ConversationDetail({
  conversation,
  onSendReply,
  onQuickReply,
  onResolve,
  onAssign,
}: ConversationDetailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = scrollRef.current?.querySelector<HTMLDivElement>(
      '[data-slot="scroll-area-viewport"]'
    );
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [conversation.messages.length]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <ExportMenu conversation={conversation} />
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={onResolve}
          >
            <CheckCircle2 className="h-4 w-4" />
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
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View visitor profile</DropdownMenuItem>
            <DropdownMenuItem>Export transcript</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <VisitorHeader conversation={conversation} />

      <ScrollArea className="min-h-0 flex-1" ref={scrollRef}>
        <div className="flex flex-col gap-4 p-4">
          {conversation.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>

      <QuickReplies onSelect={onQuickReply} />
      <ReplyInput onSend={onSendReply} />
    </div>
  );
}
