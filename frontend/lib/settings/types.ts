export type SettingsSection =
  | "general"
  | "ai-assistant"
  | "integrations"
  | "notifications"
  | "branding"
  | "team"
  | "account";

export interface GeneralSettings {
  storeName: string;
  storeUrl: string;
  supportEmail: string;
  language: string;
  timezone: string;
  currency: string;
  dateFormat: string;
}

export interface AIAssistantSettings {
  chatEnabled: boolean;
  chatGreeting: string;
  chatPlaceholder: string;
  voiceEnabled: boolean;
  voiceName: string;
  voiceSpeed: number;
  responseTone: "friendly" | "professional" | "casual";
  maxResponseLength: number;
  productRecommendations: boolean;
  fallbackMessage: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
}

export interface IntegrationSettings {
  apiKeys: ApiKey[];
  webhooks: Webhook[];
  embedCode: string;
}

export interface NotificationSettings {
  emailNewConversation: boolean;
  emailDailyReport: boolean;
  emailWeeklyReport: boolean;
  inAppVisitorAlerts: boolean;
  inAppTeamMentions: boolean;
  escalationEnabled: boolean;
  escalationTimeout: number;
  escalationEmail: string;
}

export interface BrandingSettings {
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  widgetPosition: "bottom-right" | "bottom-left";
  widgetStyle: "bubble" | "expanded";
  showBranding: boolean;
  customCSS: string;
}

export type MemberRole = "admin" | "editor" | "viewer";
export type MemberStatus = "active" | "invited" | "disabled";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  avatar?: string;
  status: MemberStatus;
}

export interface AccountSettings {
  fullName: string;
  email: string;
  phone: string;
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  theme: "light" | "dark" | "system";
}
