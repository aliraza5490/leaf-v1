import { notFound } from "next/navigation";
import { ConversationDetail } from "@/app/(pages)/dashboard/(pages)/conversations/components/conversation-detail";
import { getConversationAction } from "@/app/actions/conversations";
import { getTeamAction } from "@/app/actions/team";

export const dynamic = "force-dynamic";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [convRes, teamRes] = await Promise.all([
    getConversationAction(id),
    getTeamAction(),
  ]);

  if (!convRes.success || !convRes.data) {
    notFound();
  }

  const conversation = convRes.data;
  const teamMembers = teamRes.success && teamRes.data ? teamRes.data.team : [];

  return (
    <ConversationDetail
      conversation={conversation}
      teamMembers={teamMembers}
    />
  );
}
