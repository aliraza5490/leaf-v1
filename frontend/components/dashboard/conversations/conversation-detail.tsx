"use client";

import { useEffect, useRef } from "react";
import { AudioLines } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import type { Conversation } from "@/types/conversation";
import type { TeamMember } from "@/lib/conversations/types";
import { API_BASE_URL } from "@/lib/api/client";
import { ChatMessage } from "./chat-message";
import { VisitorHeader } from "./visitor-header";
import { ReplyInput } from "./reply-input";

interface ConversationDetailProps {
  conversation: Conversation;
  teamMembers: TeamMember[];
  onSendReply: (message: string) => void;
  onResolve: () => void;
  onAssign: (agentId: string) => void;
}

export function ConversationDetail({
  conversation,
  teamMembers,
  onSendReply,
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
      <VisitorHeader
        conversation={conversation}
        teamMembers={teamMembers}
        onResolve={onResolve}
        onAssign={onAssign}
      />

      {conversation.audioRecordingUrl && (
        <div className="flex items-center gap-2 border-b border-border/40 px-4 py-2">
          <AudioLines className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <audio
            controls
            className="h-8 w-full"
            src={`${API_BASE_URL}${conversation.audioRecordingUrl}`}
          />
        </div>
      )}

      <ScrollArea className="min-h-0 flex-1" ref={scrollRef}>
        <div className="flex flex-col gap-4 p-4">
          {conversation.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>

      <ReplyInput onSend={onSendReply} />
    </div>
  );
}
