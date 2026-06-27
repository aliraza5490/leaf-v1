"use client";

import { useState, useCallback, useEffect, use } from "react";
import { useRouter } from "next/navigation";

import { ConversationDetail } from "@/components/dashboard/conversations/conversation-detail";
import {
  getConversation,
  getTeam,
  sendAgentReply,
  updateConversation,
} from "@/lib/conversations/api";
import type { Conversation } from "@/types/conversation";
import type { TeamMember } from "@/lib/conversations/types";

export default function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    let cancelled = false;
    getConversation(id)
      .then((conv) => {
        if (!cancelled) setConversation(conv);
      })
      .catch(() => {
        if (!cancelled) setConversation(null);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    getTeam()
      .then((data) => setTeamMembers(data.team))
      .catch(() => {});
  }, []);

  const handleSendReply = useCallback(
    async (message: string) => {
      await sendAgentReply(id, message);
      const updated = await getConversation(id);
      setConversation(updated);
      router.refresh();
    },
    [id, router]
  );

  const handleQuickReply = useCallback(
    async (text: string) => {
      await sendAgentReply(id, text);
      const updated = await getConversation(id);
      setConversation(updated);
      router.refresh();
    },
    [id, router]
  );

  const handleResolve = useCallback(async () => {
    await updateConversation(id, { status: "resolved" });
    const updated = await getConversation(id);
    setConversation(updated);
    router.refresh();
  }, [id, router]);

  const handleAssign = useCallback(
    async (agentId: string) => {
      await updateConversation(id, { assigned_to: agentId });
      const updated = await getConversation(id);
      setConversation(updated);
      router.refresh();
    },
    [id, router]
  );

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading conversation...</p>
      </div>
    );
  }

  return (
    <ConversationDetail
      conversation={conversation}
      teamMembers={teamMembers}
      onSendReply={handleSendReply}
      onResolve={handleResolve}
      onAssign={handleAssign}
    />
  );
}
