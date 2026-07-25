"use client";

import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeamHeaderProps {
  onInvite: () => void;
}

export function TeamHeader({ onInvite }: TeamHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team</h1>
        <p className="text-muted-foreground">
          Manage your team members and their permissions.
        </p>
      </div>
      <Button onClick={onInvite}>
        <UserPlus className="mr-2 h-4 w-4" />
        Invite Member
      </Button>
    </div>
  );
}
