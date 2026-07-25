"use client";

import { useState } from "react";
import { MessageSquare, Mic, FlaskConical } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlaygroundSessions } from "@/app/(pages)/dashboard/(pages)/playground/hooks";
import type { PlaygroundMode, BotConfig } from "@/app/(pages)/dashboard/(pages)/playground/types";
import { SessionHistory } from "@/app/(pages)/dashboard/(pages)/playground/components/session-history";
import { TextChat } from "@/app/(pages)/dashboard/(pages)/playground/components/text-chat";
import { VoiceView } from "@/app/(pages)/dashboard/(pages)/playground/components/voice-view";
import { BotConfigPanel } from "@/app/(pages)/dashboard/(pages)/playground/components/bot-config";

export default function PlaygroundPage() {
  const [activeMode, setActiveMode] = useState<PlaygroundMode>("text");

  const {
    sessions,
    activeSession,
    activeSessionId,
    setActiveSessionId,
    createSession,
    deleteSession,
    addMessage,
    addVoiceEntry,
    updateConfig,
    clearHistory,
  } = usePlaygroundSessions();

  const handleModeChange = (mode: PlaygroundMode) => {
    setActiveMode(mode);
    const modeSession = sessions.find((s) => s.mode === mode);
    if (modeSession) {
      setActiveSessionId(modeSession.id);
    } else {
      setActiveSessionId(null);
    }
  };

  const handleNewSession = (mode: PlaygroundMode) => {
    createSession(mode);
  };

  const handleConfigChange = (partial: Partial<BotConfig>) => {
    if (activeSessionId) {
      updateConfig(activeSessionId, partial);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <FlaskConical className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Playground</h1>
            <p className="text-sm text-muted-foreground">
              Test your bot in text or voice mode
            </p>
          </div>
        </div>
        <Tabs
          value={activeMode}
          onValueChange={(v) => handleModeChange(v as PlaygroundMode)}
        >
          <TabsList>
            <TabsTrigger value="text" className="gap-1.5">
              <MessageSquare className="h-4 w-4" />
              Text
            </TabsTrigger>
            <TabsTrigger value="voice" className="gap-1.5">
              <Mic className="h-4 w-4" />
              Voice
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-1 min-h-0 rounded-xl border border-border/40 bg-background overflow-hidden">
        <div className="w-[280px] flex-shrink-0">
          <SessionHistory
            sessions={sessions}
            activeSessionId={activeSessionId}
            activeMode={activeMode}
            onSelect={setActiveSessionId}
            onNew={handleNewSession}
            onDelete={deleteSession}
            onClear={clearHistory}
          />
        </div>

        <div className="flex-1 min-w-0 border-x border-border/40">
          {activeMode === "text" ? (
            <TextChat session={activeSession} onSendMessage={addMessage} />
          ) : (
            <VoiceView
              session={activeSession}
              onAddVoiceEntry={addVoiceEntry}
            />
          )}
        </div>

        <div className="w-[320px] flex-shrink-0">
          <BotConfigPanel
            config={activeSession?.config ?? {
              model: "gpt-4o",
              systemPrompt: "",
              temperature: 0.7,
              maxTokens: 1024,
              topP: 1.0,
              frequencyPenalty: 0.0,
              tone: "friendly",
              knowledgeBaseIds: [],
              enableProducts: true,
              responseFormat: "text",
              guardrails: { blockProfanity: true, blockPII: false, maxRetries: 2 },
            }}
            onChange={handleConfigChange}
          />
        </div>
      </div>
    </div>
  );
}
