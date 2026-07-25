"use client";

import { Button } from "@/components/ui/button";
import type { SettingsSection } from "@/app/(pages)/dashboard/(pages)/settings/types";

interface SettingsHeaderProps {
  activeSection: SettingsSection;
  hasChanges: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const sectionTitles: Record<SettingsSection, { title: string; description: string }> = {
  general: {
    title: "General Settings",
    description: "Manage your store information and preferences",
  },
  integrations: {
    title: "Integrations",
    description: "Manage API keys, webhooks, and embed codes",
  },
  notifications: {
    title: "Notifications",
    description: "Set up email and in-app notification preferences",
  },
  team: {
    title: "Team Management",
    description: "Manage team members and their permissions",
  },
  account: {
    title: "Account Settings",
    description: "Manage your profile and security preferences",
  },
};

export function SettingsHeader({
  activeSection,
  hasChanges,
  onSave,
  onCancel,
}: SettingsHeaderProps) {
  const { title, description } = sectionTitles[activeSection];

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {hasChanges && (
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Changes</Button>
        </div>
      )}
    </div>
  );
}
