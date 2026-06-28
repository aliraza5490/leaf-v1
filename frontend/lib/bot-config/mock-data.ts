import type {
  SystemPromptConfig,
  ModelApiConfig,
  ConversationFlowsConfig,
  GuardrailsConfig,
  BrandingConfig,
} from "./types";

export const mockSystemPromptConfig: SystemPromptConfig = {
  botName: "Leaf Assistant",
  systemPrompt: `You are Leaf, a helpful and friendly AI shopping assistant. Your role is to help customers find products, answer questions about the store, and provide excellent customer service.

Key responsibilities:
- Help customers find products that match their needs
- Answer questions about products, shipping, and store policies
- Provide personalized recommendations based on customer preferences
- Maintain a friendly and professional tone throughout conversations

Always be helpful, honest, and respectful. If you don't know an answer, offer to connect the customer with a human agent.`,
  personalityTraits: ["friendly", "helpful", "knowledgeable", "patient"],
  responseTone: "friendly",
  language: "en",
  includeProductKnowledge: true,
  includeStoreInfo: true,
};

export const mockModelApiConfig: ModelApiConfig = {
  model: "gpt-4o",
  temperature: 0.7,
  maxTokens: 1000,
  topP: 0.9,
  frequencyPenalty: 0.0,
  presencePenalty: 0.0,
  apiBaseUrl: "",
  timeoutSeconds: 30,
  retryAttempts: 3,
};

export const mockConversationFlowsConfig: ConversationFlowsConfig = {
  welcomeMessage: "Hello! I'm Leaf, your AI shopping assistant. How can I help you today?",
  fallbackMessage: "I'm sorry, I didn't quite understand that. Could you rephrase your question?",
  maxConversationTurns: 20,
  autoCloseMinutes: 30,
  rules: [
    {
      id: "1",
      name: "Shipping Inquiry",
      trigger: "shipping|delivery|ship",
      response: "We offer free shipping on orders over $50. Standard delivery takes 3-5 business days. Would you like to know more about our shipping options?",
      enabled: true,
    },
    {
      id: "2",
      name: "Return Policy",
      trigger: "return|refund|exchange",
      response: "We offer a 30-day return policy for all unused items in original packaging. Would you like me to help you start a return?",
      enabled: true,
    },
    {
      id: "3",
      name: "Store Hours",
      trigger: "hours|open|close|when",
      response: "Our online store is available 24/7! For physical store locations, please check our website for specific hours.",
      enabled: false,
    },
  ],
  escalationTriggers: [
    {
      id: "1",
      keyword: "human|agent|person|representative",
      action: "human-handoff",
      enabled: true,
    },
    {
      id: "2",
      keyword: "complaint|angry|frustrated",
      action: "both",
      enabled: true,
    },
    {
      id: "3",
      keyword: "refund|chargeback",
      action: "email-notification",
      enabled: false,
    },
  ],
};

export const mockGuardrailsConfig: GuardrailsConfig = {
  enableContentFilter: true,
  blockedTopics: ["politics", "religion", "adult content", "violence"],
  blockedKeywords: ["competitor1", "competitor2"],
  maxMessageLength: 2000,
  rateLimitPerMinute: 30,
  preventPersonalInfo: true,
  preventExternalLinks: true,
  preventCompetitorMentions: false,
  customDisclaimer: "This is an AI assistant. Responses are generated automatically and may not always be accurate.",
};

export const mockBrandingConfig: BrandingConfig = {
  logoUrl: "",
  primaryColor: "#10b981",
  secondaryColor: "#059669",
  fontFamily: "Inter",
  widgetPosition: "bottom-right",
  widgetStyle: "bubble",
  showBranding: true,
  customCSS: "",
};

export const availableModels = [
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet" },
  { value: "claude-3-haiku", label: "Claude 3 Haiku" },
];

export const availableLanguages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
];

export const personalityOptions = [
  "friendly",
  "professional",
  "casual",
  "empathetic",
  "helpful",
  "knowledgeable",
  "patient",
  "enthusiastic",
  "witty",
  "formal",
];

export const fontFamilies = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
  { value: "Poppins", label: "Poppins" },
  { value: "Montserrat", label: "Montserrat" },
];

