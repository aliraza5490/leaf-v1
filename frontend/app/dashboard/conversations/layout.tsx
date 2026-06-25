"use client";

import { ConversationListPanel } from "@/components/dashboard/conversations/conversation-list-panel";

export default function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <ConversationListPanel>{children}</ConversationListPanel>
    </div>
  );
}
