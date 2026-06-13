"use client";

import { Bot, User, Headphones } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Message } from "@/types/conversation";
import { formatFullTime } from "@/lib/time-utils";
import { ProductCard } from "./product-card";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isVisitor = message.sender === "visitor";

  return (
    <div
      className={cn(
        "flex gap-3",
        isVisitor ? "flex-row" : "flex-row-reverse"
      )}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback
          className={cn(
            "text-xs",
            isVisitor
              ? "bg-muted text-muted-foreground"
              : message.sender === "ai"
                ? "bg-primary/20 text-primary"
                : "bg-chart-3/20 text-chart-3"
          )}
        >
          {isVisitor ? (
            <User className="h-4 w-4" />
          ) : message.sender === "ai" ? (
            <Bot className="h-4 w-4" />
          ) : (
            <Headphones className="h-4 w-4" />
          )}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "flex max-w-[70%] flex-col",
          isVisitor ? "items-start" : "items-end"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5",
            isVisitor
              ? "bg-muted text-foreground"
              : message.sender === "ai"
                ? "bg-primary/10 text-foreground border border-primary/20"
                : "bg-chart-3/10 text-foreground border border-chart-3/20"
          )}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          {message.productCard && (
            <ProductCard product={message.productCard} />
          )}
        </div>
        <span className="mt-1 text-[10px] text-muted-foreground px-1">
          {formatFullTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
