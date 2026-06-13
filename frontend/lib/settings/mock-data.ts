import type {
  GeneralSettings,
  AIAssistantSettings,
  IntegrationSettings,
  NotificationSettings,
  BrandingSettings,
  TeamMember,
  AccountSettings,
} from "./types";

export const mockGeneralSettings: GeneralSettings = {
  storeName: "Leaf Demo Store",
  storeUrl: "https://demo.leaf-store.com",
  supportEmail: "support@leaf-store.com",
  language: "en",
  timezone: "America/New_York",
  currency: "USD",
  dateFormat: "MM/DD/YYYY",
};

export const mockAIAssistantSettings: AIAssistantSettings = {
  chatEnabled: true,
  chatGreeting: "Hello! I'm Leaf, your AI shopping assistant. How can I help you today?",
  chatPlaceholder: "Type your message...",
  voiceEnabled: true,
  voiceName: "Leaf Assistant",
  voiceSpeed: 1.0,
  responseTone: "friendly",
  maxResponseLength: 500,
  productRecommendations: true,
  fallbackMessage: "I'm sorry, I didn't quite understand that. Could you rephrase your question?",
};

export const mockIntegrationSettings: IntegrationSettings = {
  apiKeys: [
    {
      id: "1",
      name: "Production API Key",
      key: "sk_live_••••••••••••••••••••3f8a",
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      name: "Development Key",
      key: "sk_test_••••••••••••••••••••7b2c",
      createdAt: "2024-02-20T14:45:00Z",
    },
  ],
  webhooks: [
    {
      id: "1",
      url: "https://api.mystore.com/webhooks/leaf",
      events: ["conversation.created", "conversation.updated"],
      active: true,
    },
    {
      id: "2",
      url: "https://hooks.slack.com/services/T00/B00/xxx",
      events: ["escalation.required"],
      active: false,
    },
  ],
  embedCode: `<script src="https://cdn.leaf.ai/widget.js"></script>
<script>
  Leaf.init({
    storeId: 'store_abc123',
    position: 'bottom-right',
    theme: 'auto'
  });
</script>`,
};

export const mockNotificationSettings: NotificationSettings = {
  emailNewConversation: true,
  emailDailyReport: true,
  emailWeeklyReport: false,
  inAppVisitorAlerts: true,
  inAppTeamMentions: true,
  escalationEnabled: true,
  escalationTimeout: 5,
  escalationEmail: "escalations@leaf-store.com",
};

export const mockBrandingSettings: BrandingSettings = {
  logoUrl: "",
  primaryColor: "#10b981",
  secondaryColor: "#059669",
  fontFamily: "Inter",
  widgetPosition: "bottom-right",
  widgetStyle: "bubble",
  showBranding: true,
  customCSS: "",
};

export const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@leaf-store.com",
    role: "admin",
    status: "active",
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike@leaf-store.com",
    role: "editor",
    status: "active",
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily@leaf-store.com",
    role: "viewer",
    status: "active",
  },
  {
    id: "4",
    name: "Alex Thompson",
    email: "alex@external.com",
    role: "viewer",
    status: "invited",
  },
];

export const mockAccountSettings: AccountSettings = {
  fullName: "Store Owner",
  email: "admin@leaf.com",
  phone: "+1 (555) 123-4567",
  twoFactorEnabled: false,
  sessionTimeout: 60,
  theme: "system",
};

export const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "ar", label: "Arabic" },
];

export const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Asia/Shanghai", label: "China Standard Time (CST)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
];

export const currencies = [
  { value: "USD", label: "US Dollar ($)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "JPY", label: "Japanese Yen (¥)" },
  { value: "CAD", label: "Canadian Dollar (C$)" },
  { value: "AUD", label: "Australian Dollar (A$)" },
];

export const dateFormats = [
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

export const webhookEvents = [
  { value: "conversation.created", label: "Conversation Created" },
  { value: "conversation.updated", label: "Conversation Updated" },
  { value: "conversation.closed", label: "Conversation Closed" },
  { value: "escalation.required", label: "Escalation Required" },
  { value: "product.recommended", label: "Product Recommended" },
  { value: "visitor.engaged", label: "Visitor Engaged" },
];

export const fontFamilies = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
  { value: "Poppins", label: "Poppins" },
  { value: "Montserrat", label: "Montserrat" },
];
