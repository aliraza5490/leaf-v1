export type BotConfigTab = "system-prompt" | "model-api" | "conversation-flows" | "guardrails" | "branding";

export interface SystemPromptConfig {
  botName: string;
  systemPrompt: string;
  personalityTraits: string[];
  responseTone: "friendly" | "professional" | "casual" | "empathetic";
  language: string;
  includeProductKnowledge: boolean;
  includeStoreInfo: boolean;
}

export interface ModelApiConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  apiBaseUrl: string;
  timeoutSeconds: number;
  retryAttempts: number;
}

export interface ConversationRule {
  id: string;
  name: string;
  trigger: string;
  response: string;
  enabled: boolean;
}

export interface EscalationTrigger {
  id: string;
  keyword: string;
  action: "human-handoff" | "email-notification" | "both";
  enabled: boolean;
}

export interface ConversationFlowsConfig {
  welcomeMessage: string;
  fallbackMessage: string;
  maxConversationTurns: number;
  autoCloseMinutes: number;
  rules: ConversationRule[];
  escalationTriggers: EscalationTrigger[];
}

export interface GuardrailsConfig {
  enableContentFilter: boolean;
  blockedTopics: string[];
  blockedKeywords: string[];
  maxMessageLength: number;
  rateLimitPerMinute: number;
  preventPersonalInfo: boolean;
  preventExternalLinks: boolean;
  preventCompetitorMentions: boolean;
  customDisclaimer: string;
}

export interface BrandingConfig {
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  widgetPosition: "bottom-right" | "bottom-left";
  widgetStyle: "bubble" | "expanded";
  showBranding: boolean;
  customCSS: string;
}

