"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BotConfigHeader } from "@/app/(pages)/dashboard/(pages)/bot-config/components/bot-config-header";
import { SystemPromptConfig } from "@/app/(pages)/dashboard/(pages)/bot-config/components/sections/system-prompt-config";
import { ModelApiConfig } from "@/app/(pages)/dashboard/(pages)/bot-config/components/sections/model-api-settings";
import { ConversationFlowsConfig } from "@/app/(pages)/dashboard/(pages)/bot-config/components/sections/conversation-flows";
import { GuardrailsConfig } from "@/app/(pages)/dashboard/(pages)/bot-config/components/sections/guardrails-filters";
import { BrandingConfigSettings } from "@/app/(pages)/dashboard/(pages)/bot-config/components/sections/branding-settings";
import type { BotConfigTab } from "@/app/(pages)/dashboard/(pages)/bot-config/types";
import {
  mockSystemPromptConfig,
  mockModelApiConfig,
  mockConversationFlowsConfig,
  mockGuardrailsConfig,
  mockBrandingConfig,
} from "@/lib/bot-config/mock-data";

export default function BotConfigPage() {
  const [activeTab, setActiveTab] = useState<BotConfigTab>("branding");
  const [hasChanges, setHasChanges] = useState(false);

  const [systemPromptConfig, setSystemPromptConfig] = useState(mockSystemPromptConfig);
  const [modelApiConfig, setModelApiConfig] = useState(mockModelApiConfig);
  const [conversationFlowsConfig, setConversationFlowsConfig] = useState(mockConversationFlowsConfig);
  const [guardrailsConfig, setGuardrailsConfig] = useState(mockGuardrailsConfig);
  const [brandingConfig, setBrandingConfig] = useState(mockBrandingConfig);

  const handleSave = () => {
    toast.success("Bot configuration saved successfully");
    setHasChanges(false);
  };

  const handleCancel = () => {
    setSystemPromptConfig(mockSystemPromptConfig);
    setModelApiConfig(mockModelApiConfig);
    setConversationFlowsConfig(mockConversationFlowsConfig);
    setGuardrailsConfig(mockGuardrailsConfig);
    setBrandingConfig(mockBrandingConfig);
    setHasChanges(false);
  };

  const markAsChanged = () => setHasChanges(true);

  return (
    <div className="flex flex-col gap-6">
      <BotConfigHeader
        hasChanges={hasChanges}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as BotConfigTab)}
        className="w-full"
      >
        <TabsList variant="line">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="system-prompt">System Prompt</TabsTrigger>
          <TabsTrigger value="model-api">Model & API</TabsTrigger>
          <TabsTrigger value="conversation-flows">Conversation Flows</TabsTrigger>
          <TabsTrigger value="guardrails">Guardrails</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="mt-6">
          <BrandingConfigSettings
            config={brandingConfig}
            onConfigChange={(c) => {
              setBrandingConfig(c);
              markAsChanged();
            }}
          />
        </TabsContent>

        <TabsContent value="system-prompt" className="mt-6">
          <SystemPromptConfig
            config={systemPromptConfig}
            onConfigChange={(c) => {
              setSystemPromptConfig(c);
              markAsChanged();
            }}
          />
        </TabsContent>

        <TabsContent value="model-api" className="mt-6">
          <ModelApiConfig
            config={modelApiConfig}
            onConfigChange={(c) => {
              setModelApiConfig(c);
              markAsChanged();
            }}
          />
        </TabsContent>

        <TabsContent value="conversation-flows" className="mt-6">
          <ConversationFlowsConfig
            config={conversationFlowsConfig}
            onConfigChange={(c) => {
              setConversationFlowsConfig(c);
              markAsChanged();
            }}
          />
        </TabsContent>

        <TabsContent value="guardrails" className="mt-6">
          <GuardrailsConfig
            config={guardrailsConfig}
            onConfigChange={(c) => {
              setGuardrailsConfig(c);
              markAsChanged();
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

