"use client";

import { useState, useEffect, useCallback } from "react";
import { Mic, Square, RotateCcw, Bot, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type {
  PlaygroundSession,
  VoiceState,
  VoiceEntry,
} from "@/app/(pages)/dashboard/(pages)/playground/types";

interface VoiceViewProps {
  session: PlaygroundSession | null;
  onAddVoiceEntry: (sessionId: string, entry: VoiceEntry) => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStateLabel(state: VoiceState): string {
  switch (state) {
    case "connecting":
      return "Connecting...";
    case "listening":
      return "Listening...";
    case "processing":
      return "Thinking...";
    case "speaking":
      return "Speaking...";
    case "error":
      return "Error";
    default:
      return "Ready";
  }
}

function getStateColor(state: VoiceState): string {
  switch (state) {
    case "connecting":
      return "text-amber-500";
    case "listening":
      return "text-primary";
    case "processing":
      return "text-blue-500";
    case "speaking":
      return "text-purple-500";
    case "error":
      return "text-destructive";
    default:
      return "text-muted-foreground";
  }
}

function getStateRingColor(state: VoiceState): string {
  switch (state) {
    case "connecting":
      return "bg-amber-500";
    case "listening":
      return "bg-primary";
    case "processing":
      return "bg-blue-500";
    case "speaking":
      return "bg-purple-500";
    case "error":
      return "bg-destructive";
    default:
      return "bg-muted-foreground";
  }
}

const MOCK_TRANSCRIPTS = [
  "Hi, I'm looking for a gift for my friend",
  "Do you have anything in the blue color?",
  "What's the price range for that?",
  "Can you show me something similar?",
  "That sounds great, tell me more",
];

const MOCK_RESPONSES = [
  "I'd love to help you find the perfect gift! Let me show you some options.",
  "We have several items available in blue. Here are our top picks.",
  "That item ranges from $29 to $89 depending on the variant.",
  "Sure! Here are some similar products you might like.",
  "Great choice! This product features premium materials and has excellent reviews.",
];

export function VoiceView({ session, onAddVoiceEntry }: VoiceViewProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [agentText, setAgentText] = useState("");

  const simulateConversation = useCallback(() => {
    const transcriptIdx = Math.floor(
      Math.random() * MOCK_TRANSCRIPTS.length
    );
    const responseIdx = Math.floor(Math.random() * MOCK_RESPONSES.length);

    setVoiceState("listening");
    setTranscript("");

    setTimeout(() => {
      const userText = MOCK_TRANSCRIPTS[transcriptIdx];
      setTranscript(userText);

      setTimeout(() => {
        setVoiceState("processing");
        setTranscript("");

        setTimeout(() => {
          const botText = MOCK_RESPONSES[responseIdx];
          setVoiceState("speaking");
          setAgentText(botText);

          if (session) {
            const userEntry: VoiceEntry = {
              id: generateId(),
              role: "user",
              transcript: userText,
              timestamp: new Date().toISOString(),
            };
            const botEntry: VoiceEntry = {
              id: generateId(),
              role: "assistant",
              transcript: botText,
              timestamp: new Date().toISOString(),
            };
            onAddVoiceEntry(session.id, userEntry);
            setTimeout(() => {
              onAddVoiceEntry(session.id, botEntry);
            }, 50);
          }

          setTimeout(() => {
            setAgentText("");
            setVoiceState("idle");
          }, 3000);
        }, 1500);
      }, 1500);
    }, 2000);
  }, [session, onAddVoiceEntry]);

  const handleStart = () => {
    if (!session) return;
    setVoiceState("connecting");
    setTimeout(() => {
      simulateConversation();
    }, 1200);
  };

  const handleStop = () => {
    setVoiceState("idle");
    setTranscript("");
    setAgentText("");
  };

  const handleReset = () => {
    setVoiceState("idle");
    setTranscript("");
    setAgentText("");
  };

  useEffect(() => {
    return () => {
      setVoiceState("idle");
    };
  }, [session?.id]);

  if (!session) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Mic className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No active session</h3>
        <p className="text-sm text-muted-foreground max-w-[280px]">
          Create a new voice session from the left panel to start testing
        </p>
      </div>
    );
  }

  const isActive =
    voiceState === "listening" ||
    voiceState === "processing" ||
    voiceState === "speaking" ||
    voiceState === "connecting";
  const ringColor = getStateRingColor(voiceState);
  const isAnimating =
    voiceState === "listening" || voiceState === "speaking";

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center min-h-0">
        <div className="relative flex items-center justify-center mb-8">
          <div
            className={cn(
              "absolute w-36 h-36 rounded-full opacity-10 transition-all duration-500",
              ringColor,
              isAnimating && "animate-pulse"
            )}
          />
          <div
            className={cn(
              "absolute w-28 h-28 rounded-full opacity-20 transition-all duration-500",
              ringColor,
              isAnimating && "animate-pulse"
            )}
            style={{ animationDelay: "0.3s" }}
          />
          <div
            className={cn(
              "absolute w-20 h-20 rounded-full opacity-30 transition-all duration-500",
              ringColor,
              isAnimating && "animate-pulse"
            )}
            style={{ animationDelay: "0.6s" }}
          />
          <div
            className={cn(
              "relative w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300",
              isActive ? ringColor : "bg-muted-foreground"
            )}
          >
            <Mic className="h-7 w-7" />
          </div>
        </div>

        <p
          className={cn(
            "text-sm font-medium mb-2 transition-colors",
            getStateColor(voiceState)
          )}
        >
          {getStateLabel(voiceState)}
        </p>

        {transcript && voiceState === "listening" && (
          <div className="px-8 text-center max-w-[400px] animate-in fade-in duration-300">
            <p className="text-sm text-muted-foreground italic">
              &ldquo;{transcript}&rdquo;
            </p>
          </div>
        )}

        {agentText && voiceState === "speaking" && (
          <div className="px-8 text-center max-w-[400px] animate-in fade-in duration-300">
            <p className="text-sm text-foreground">{agentText}</p>
          </div>
        )}
      </div>

      {session.voiceEntries.length > 0 && (
        <ScrollArea className="h-[180px] border-t border-border/40">
          <div className="flex flex-col gap-3 p-4">
            {session.voiceEntries.map((entry) => (
              <div
                key={entry.id}
                className={cn(
                  "flex gap-2.5",
                  entry.role === "user" ? "flex-row" : "flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full",
                    entry.role === "user"
                      ? "bg-muted"
                      : "bg-primary/20"
                  )}
                >
                  {entry.role === "user" ? (
                    <User className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <Bot className="h-3 w-3 text-primary" />
                  )}
                </div>
                <div className="flex flex-col gap-0.5 max-w-[70%]">
                  <p className="text-xs text-foreground">
                    {entry.transcript}
                  </p>
                  <span className="text-[10px] text-muted-foreground">
                    {formatTime(entry.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      <div className="flex items-center justify-center gap-3 border-t border-border/40 p-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handleReset}
          disabled={isActive}
          className="h-10 w-10"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        {isActive ? (
          <Button
            variant="destructive"
            size="lg"
            onClick={handleStop}
            className="h-12 w-12 rounded-full"
          >
            <Square className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={handleStart}
            className="h-12 w-12 rounded-full"
          >
            <Mic className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
