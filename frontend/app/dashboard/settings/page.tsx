"use client";

import { useState } from "react";
import { toast } from "sonner";
import { SettingsSidebar } from "@/components/dashboard/settings/settings-sidebar";
import { SettingsHeader } from "@/components/dashboard/settings/settings-header";
import { GeneralSettings } from "@/components/dashboard/settings/sections/general-settings";
import { AIAssistantSettings } from "@/components/dashboard/settings/sections/ai-assistant-settings";
import { IntegrationSettings } from "@/components/dashboard/settings/sections/integration-settings";
import { NotificationSettings } from "@/components/dashboard/settings/sections/notification-settings";
import { BrandingSettings } from "@/components/dashboard/settings/sections/branding-settings";
import { TeamSettings } from "@/components/dashboard/settings/sections/team-settings";
import { AccountSettings } from "@/components/dashboard/settings/sections/account-settings";
import type { SettingsSection } from "@/lib/settings/types";
import {
  mockGeneralSettings,
  mockAIAssistantSettings,
  mockIntegrationSettings,
  mockNotificationSettings,
  mockBrandingSettings,
  mockTeamMembers,
  mockAccountSettings,
} from "@/lib/settings/mock-data";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("general");
  const [hasChanges, setHasChanges] = useState(false);

  const [generalSettings, setGeneralSettings] = useState(mockGeneralSettings);
  const [aiSettings, setAISettings] = useState(mockAIAssistantSettings);
  const [integrationSettings, setIntegrationSettings] = useState(mockIntegrationSettings);
  const [notificationSettings, setNotificationSettings] = useState(mockNotificationSettings);
  const [brandingSettings, setBrandingSettings] = useState(mockBrandingSettings);
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers);
  const [accountSettings, setAccountSettings] = useState(mockAccountSettings);

  const handleSave = () => {
    toast.success("Settings saved successfully");
    setHasChanges(false);
  };

  const handleCancel = () => {
    setGeneralSettings(mockGeneralSettings);
    setAISettings(mockAIAssistantSettings);
    setIntegrationSettings(mockIntegrationSettings);
    setNotificationSettings(mockNotificationSettings);
    setBrandingSettings(mockBrandingSettings);
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
      case "ai-assistant":
        return (
          <AIAssistantSettings
            settings={aiSettings}
            onSettingsChange={(s) => {
              setAISettings(s);
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
      case "branding":
        return (
          <BrandingSettings
            settings={brandingSettings}
            onSettingsChange={(s) => {
              setBrandingSettings(s);
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

        <div className="flex-1 min-w-0">{renderContent()}</div>
      </div>
    </div>
  );
}
