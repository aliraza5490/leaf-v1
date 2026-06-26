"use client";

import { useRef, useEffect } from "react";
import { Bot, User, Headphones } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Message } from "@/types/conversation";
import { formatFullTime } from "@/lib/time-utils";
import { ProductCard } from "./product-card";
import { Markdown } from "@/components/ui/markdown";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isVisitor = message.sender === "visitor";
  const productsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = productsScrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

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
          "flex max-w-[70%] flex-col overflow-hidden",
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
          <Markdown content={message.content} className="text-sm break-words" />
          {(!message.products || message.products.length === 0) && message.productCard && (
            <ProductCard product={message.productCard} />
          )}
        </div>

        {message.products && message.products.length > 0 && (
          <div ref={productsScrollRef} className="mt-2 w-full overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 pb-1" style={{ width: "max-content" }}>
              {message.products.map((product) => (
                <div key={product.id} className="w-[180px] flex-shrink-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
        <span className="mt-1 text-[10px] text-muted-foreground px-1">
          {formatFullTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
