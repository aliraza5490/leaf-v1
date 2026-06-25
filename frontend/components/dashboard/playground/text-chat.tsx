"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { PlaygroundMessage, PlaygroundSession } from "@/lib/playground/types";

interface TextChatProps {
  session: PlaygroundSession | null;
  onSendMessage: (sessionId: string, message: PlaygroundMessage) => void;
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

const MOCK_RESPONSES = [
  "I'd be happy to help you find the perfect product! What are you looking for today?",
  "Great question! Let me check our catalog for you. We have several options that might work.",
  "Based on what you're describing, I'd recommend checking out our featured collection. Would you like me to show you some options?",
  "That's a popular choice! We have it available in several variants. Would you like to see the details?",
  "I can definitely help with that! Here's what I found in our store...",
  "Thanks for reaching out! Our current bestsellers include some amazing products. Want me to walk you through them?",
];

function getMockResponse(): string {
  return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
}

export function TextChat({ session, onSendMessage }: TextChatProps) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = scrollRef.current?.querySelector<HTMLDivElement>(
      '[data-slot="scroll-area-viewport"]'
    );
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [session?.messages.length, isTyping]);

  const handleSend = () => {
    if (!input.trim() || !session) return;

    const userMessage: PlaygroundMessage = {
      id: generateId(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    onSendMessage(session.id, userMessage);
    setInput("");

    setIsTyping(true);
    setTimeout(() => {
      const assistantMessage: PlaygroundMessage = {
        id: generateId(),
        role: "assistant",
        content: getMockResponse(),
        timestamp: new Date().toISOString(),
      };
      onSendMessage(session.id, assistantMessage);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!session) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Bot className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No active session</h3>
        <p className="text-sm text-muted-foreground max-w-[280px]">
          Create a new session from the left panel to start testing the bot
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 min-h-0" ref={scrollRef}>
        <div className="flex flex-col gap-4 p-4">
          {session.messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-1">
                Start a conversation
              </h3>
              <p className="text-sm text-muted-foreground max-w-[300px]">
                Type a message below to test how the bot responds. The bot will
                use the configuration from the right panel.
              </p>
            </div>
          )}
          {session.messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "flex-row" : "flex-row-reverse"
              )}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback
                  className={cn(
                    "text-xs",
                    message.role === "user"
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary/20 text-primary"
                  )}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "flex max-w-[70%] flex-col",
                  message.role === "user" ? "items-start" : "items-end"
                )}
              >
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5",
                    message.role === "user"
                      ? "bg-muted text-foreground"
                      : "bg-primary/10 text-foreground border border-primary/20"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </div>
                <span className="mt-1 text-[10px] text-muted-foreground px-1">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3 flex-row-reverse">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="text-xs bg-primary/20 text-primary">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex max-w-[70%] flex-col items-end">
                <div className="rounded-2xl px-4 py-3 bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
                    <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-border/40 p-4">
        <div className="flex gap-2">
          <Textarea
            placeholder="Type a message to test the bot..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[60px] max-h-[200px] resize-none"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="self-end"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
