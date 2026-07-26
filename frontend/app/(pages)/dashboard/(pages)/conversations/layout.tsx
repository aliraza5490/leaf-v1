import { ConversationListPanel } from "@/app/(pages)/dashboard/(pages)/conversations/components/conversation-list-panel";

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
