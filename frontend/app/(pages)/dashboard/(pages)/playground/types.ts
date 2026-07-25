export type PlaygroundMode = "text" | "voice";

export type VoiceState =
  | "idle"
  | "connecting"
  | "listening"
  | "processing"
  | "speaking"
  | "error";

export interface PlaygroundMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface VoiceEntry {
  id: string;
  role: "user" | "assistant";
  transcript: string;
  timestamp: string;
}

export interface BotConfig {
  model: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  tone: string;
  knowledgeBaseIds: string[];
  enableProducts: boolean;
  responseFormat: "text" | "json" | "markdown";
  guardrails: {
    blockProfanity: boolean;
    blockPII: boolean;
    maxRetries: number;
  };
}

export interface PlaygroundSession {
  id: string;
  title: string;
  mode: PlaygroundMode;
  messages: PlaygroundMessage[];
  voiceEntries: VoiceEntry[];
  config: BotConfig;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_BOT_CONFIG: BotConfig = {
  model: "gpt-4o",
  systemPrompt:
    "You are a helpful shopping assistant for an e-commerce store. Help customers find products, answer questions, and provide a friendly experience.",
  temperature: 0.7,
  maxTokens: 1024,
  topP: 1.0,
  frequencyPenalty: 0.0,
  tone: "friendly",
  knowledgeBaseIds: [],
  enableProducts: true,
  responseFormat: "text",
  guardrails: {
    blockProfanity: true,
    blockPII: false,
    maxRetries: 2,
  },
};
