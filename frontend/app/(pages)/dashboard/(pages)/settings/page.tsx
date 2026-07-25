"use client";

import { useState } from "react";
import { toast } from "sonner";
import { SettingsSidebar } from "@/app/(pages)/dashboard/(pages)/settings/components/settings-sidebar";
import { SettingsHeader } from "@/app/(pages)/dashboard/(pages)/settings/components/settings-header";
import { GeneralSettings } from "@/app/(pages)/dashboard/(pages)/settings/components/sections/general-settings";
import { IntegrationSettings } from "@/app/(pages)/dashboard/(pages)/settings/components/sections/integration-settings";
import { NotificationSettings } from "@/app/(pages)/dashboard/(pages)/settings/components/sections/notification-settings";
import { TeamSettings } from "@/app/(pages)/dashboard/(pages)/settings/components/sections/team-settings";
import { AccountSettings } from "@/app/(pages)/dashboard/(pages)/settings/components/sections/account-settings";
import type { SettingsSection } from "@/app/(pages)/dashboard/(pages)/settings/types";
import {
  mockGeneralSettings,
  mockIntegrationSettings,
  mockNotificationSettings,
  mockTeamMembers,
  mockAccountSettings,
} from "@/lib/settings/mock-data";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("general");
  const [hasChanges, setHasChanges] = useState(false);

  const [generalSettings, setGeneralSettings] = useState(mockGeneralSettings);
  const [integrationSettings, setIntegrationSettings] = useState(mockIntegrationSettings);
  const [notificationSettings, setNotificationSettings] = useState(mockNotificationSettings);
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers);
  const [accountSettings, setAccountSettings] = useState(mockAccountSettings);

  const handleSave = () => {
    toast.success("Settings saved successfully");
    setHasChanges(false);
  };

  const handleCancel = () => {
    setGeneralSettings(mockGeneralSettings);
    setIntegrationSettings(mockIntegrationSettings);
    setNotificationSettings(mockNotificationSettings);
    setTeamMembers(mockTeamMembers);
    setAccountSettings(mockAccountSettings);
    setHasChanges(false);
  };

  const markAsChanged = () => setHasChanges(true);

  const renderContent = () => {
    switch (activeSection) {
      case "general":
        return (
          <GeneralSettings
            settings={generalSettings}
            onSettingsChange={(s) => {
              setGeneralSettings(s);
              markAsChanged();
            }}
          />
        );
      case "integrations":
        return (
          <IntegrationSettings
            settings={integrationSettings}
            onSettingsChange={(s) => {
              setIntegrationSettings(s);
              markAsChanged();
            }}
          />
        );
      case "notifications":
        return (
          <NotificationSettings
            settings={notificationSettings}
            onSettingsChange={(s) => {
              setNotificationSettings(s);
              markAsChanged();
            }}
          />
        );

      case "team":
        return (
          <TeamSettings
            members={teamMembers}
            onMembersChange={(m) => {
              setTeamMembers(m);
              markAsChanged();
            }}
          />
        );
      case "account":
        return (
          <AccountSettings
            settings={accountSettings}
            onSettingsChange={(s) => {
              setAccountSettings(s);
              markAsChanged();
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <SettingsHeader
        activeSection={activeSection}
        hasChanges={hasChanges}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <div className="flex gap-8">
        <SettingsSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <div className="border-l border-border" />

        <div className="flex-1 min-w-0">{renderContent()}</div>
      </div>
    </div>
  );
}
