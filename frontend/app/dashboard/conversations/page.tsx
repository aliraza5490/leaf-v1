export default function ConversationsPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-medium">No conversation selected</p>
        <p className="text-sm text-muted-foreground">
          Select a conversation from the list to view details
        </p>
      </div>
    </div>
  );
}
