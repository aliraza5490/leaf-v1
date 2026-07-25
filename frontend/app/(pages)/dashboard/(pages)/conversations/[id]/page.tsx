"use client";

import { useState, useCallback, useEffect, use } from "react";
import { useRouter } from "next/navigation";

import { ConversationDetail } from "@/app/(pages)/dashboard/(pages)/conversations/components/conversation-detail";
import {
  getConversation,
  getTeam,
  updateConversation,
} from "@/lib/api/conversations";
import type { Conversation, ConversationTeamMember } from "@/app/(pages)/dashboard/(pages)/conversations/types";

export default function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [teamMembers, setTeamMembers] = useState<ConversationTeamMember[]>([]);

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

  const handleUpdateTags = useCallback(
    async (tags: string[]) => {
      await updateConversation(id, { tags: tags.join(",") });
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
      onResolve={handleResolve}
      onAssign={handleAssign}
      onUpdateTags={handleUpdateTags}
    />
  );
}
