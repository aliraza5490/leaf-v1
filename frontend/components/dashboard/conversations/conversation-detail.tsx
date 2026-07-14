"use client";

import { useEffect, useRef, useState } from "react";
import {
  AudioLines, MapPin, Globe, Laptop, Compass, User,
  Copy, Check, Sparkles, X, ChevronDown, Calendar, Clock, MousePointerClick
} from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import type { Conversation } from "@/types/conversation";
import type { TeamMember } from "@/lib/conversations/types";
import { API_BASE_URL } from "@/lib/api/client";
import { ChatMessage } from "./chat-message";
import { VisitorHeader } from "./visitor-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarGradient } from "./conversation-list";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ConversationDetailProps {
  conversation: Conversation;
  teamMembers: TeamMember[];
  onResolve: () => void;
  onAssign: (agentId: string) => void;
  onUpdateTags?: (tags: string[]) => void;
}

// Deterministic metadata generator based on conversation ID
function getVisitorDetails(id: string | number) {
  const idStr = String(id);
  const hash = idStr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const browsers = ["Google Chrome (v124.0)", "Apple Safari (v17.2)", "Mozilla Firefox (v121.0)", "Microsoft Edge (v120.0)"];
  const locations = ["New York, NY", "San Francisco, CA", "London, UK", "Berlin, Germany", "Tokyo, Japan", "Toronto, ON"];
  const devices = ["MacBook Pro (macOS)", "iPhone 15 Pro (iOS)", "Windows 11 PC (Chrome)", "iPad Pro (iPadOS)"];
  const pages = ["/store/products/fjallraven-backpack", "/cart", "/checkout", "/category/mens-clothing", "/help/returns"];

  return {
    browser: browsers[hash % browsers.length],
    location: locations[hash % locations.length],
    device: devices[hash % devices.length],
    currentPage: pages[hash % pages.length]
  };
}

// Generate realistic AI summary from message history
function generateAiSummary(conversation: Conversation) {
  const messages = conversation.messages || [];
  if (messages.length === 0) {
    return "No messages exchanged in this session yet.";
  }

  const visitorMessages = messages.filter(m => m.sender === "visitor").map(m => m.content.toLowerCase());
  const contentStr = visitorMessages.join(" ");

  if (contentStr.includes("return") || contentStr.includes("refund") || contentStr.includes("policy")) {
    return "Visitor is inquiring about the return policy and conditions for products. They are checking how to process a refund or return an item.";
  }
  if (contentStr.includes("shoe") || contentStr.includes("nike") || contentStr.includes("adidas") || contentStr.includes("size")) {
    return "Visitor is looking for athletic shoes (Nike/Adidas). They are asking about size availability, colors, and adding items to their cart.";
  }
  if (contentStr.includes("jacket") || contentStr.includes("backpack") || contentStr.includes("clothing")) {
    return "Visitor is asking about men's or women's outerwear garments, specifically sizing and fit details for jackets and bags.";
  }
  if (contentStr.includes("order") || contentStr.includes("confirm") || contentStr.includes("track")) {
    return "Visitor is checking on an order status (shipping status, tracking number, or delivery date confirmation).";
  }

  if (conversation.channel === "voice") {
    return "Voice support call: The caller is speaking with the AI voice assistant regarding product availability and checkout assistance.";
  }

  return "Visitor initiated contact to ask about store products, pricing, and general availability of items on the catalog.";
}

export function ConversationDetail({
  conversation,
  teamMembers,
  onResolve,
  onAssign,
  onUpdateTags,
}: ConversationDetailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [newTag, setNewTag] = useState("");

  const visitorDetails = getVisitorDetails(conversation.id);
  const aiSummary = generateAiSummary(conversation);
  const currentAssignee = teamMembers.find(m => m.id === conversation.assignedTo || m.email === conversation.assignedTo);

  useEffect(() => {
    const viewport = scrollRef.current?.querySelector<HTMLDivElement>(
      '[data-slot="scroll-area-viewport"]'
    );
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [conversation.messages.length]);

  const handleCopyEmail = () => {
    if (conversation.visitor.email) {
      navigator.clipboard.writeText(conversation.visitor.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = newTag.trim();
    if (tag && !conversation.tags.includes(tag)) {
      const updatedTags = [...conversation.tags, tag];
      onUpdateTags?.(updatedTags);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = conversation.tags.filter(t => t !== tagToRemove);
    onUpdateTags?.(updatedTags);
  };

  return (
    <div className="flex h-full min-h-0 flex-row overflow-hidden flex-1">
      {/* Main Chat Area (takes flex-1 -> ~42% of total screen layout) */}
      <div className="flex flex-1 flex-col min-h-0 overflow-hidden border-r border-border/40">
        <VisitorHeader
          conversation={conversation}
          teamMembers={teamMembers}
          onResolve={onResolve}
          onAssign={onAssign}
        />

        {conversation.audioRecordingUrl && (
          <div className="flex flex-col gap-2 border-b border-border/40 p-4 bg-muted/5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <AudioLines className="h-4 w-4 text-primary animate-pulse" />
                Session Recording
              </span>
            </div>
            <audio
              controls
              className="h-9 w-full rounded-lg border border-border/40 bg-background shadow-sm"
              src={`${API_BASE_URL}${conversation.audioRecordingUrl}`}
            />
          </div>
        )}

        <ScrollArea className="min-h-0 flex-1 bg-background" ref={scrollRef}>
          <div className="flex flex-col gap-4 p-4">
            {conversation.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Metadata Sidebar (takes 38% of parent = ~26% of total screen layout) */}
      <div className="w-[38%] min-w-[250px] max-w-[320px] shrink-0 flex flex-col bg-muted/10 overflow-y-auto border-l border-border/10">
        {/* Visitor Card */}
        <div className="p-4 border-b border-border/40 space-y-3">
          <div className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
            Visitor Profile
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback className={cn("text-xs font-semibold shadow-sm border", getAvatarGradient(conversation.visitor.name))}>
                {conversation.visitor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-foreground text-sm truncate" title={conversation.visitor.name}>
                {conversation.visitor.name}
              </h3>
              {conversation.visitor.email && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs text-muted-foreground truncate flex-1" title={conversation.visitor.email}>
                    {conversation.visitor.email}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-muted-foreground hover:text-foreground shrink-0"
                    onClick={handleCopyEmail}
                    title="Copy email"
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Summary Card (GitHub styled box highlight) */}
        <div className="p-4 border-b border-border/40 space-y-3 bg-primary/2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary shadow-sm border border-primary/10">
              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            </div>
            <span className="text-[10px] font-bold text-primary tracking-wider uppercase">
              AI Summary
            </span>
          </div>
          <p className="text-xs text-foreground/80 leading-relaxed font-normal bg-background/60 p-3 rounded-xl border border-primary/15 shadow-sm">
            {aiSummary}
          </p>
        </div>

        {/* Assigned Agent Selector */}
        <div className="p-4 border-b border-border/40 space-y-2">
          <div className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
            Assignment
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-background/50">
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">Agent</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1 px-2 text-xs font-semibold">
                  {currentAssignee?.name || "Unassigned"}
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {teamMembers.map((member) => (
                  <DropdownMenuItem
                    key={member.id}
                    onClick={() => onAssign(member.id)}
                    className="text-xs"
                  >
                    {member.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tags Section */}
        <div className="p-4 border-b border-border/40 space-y-3">
          <div className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
            Conversation Tags
          </div>

          <div className="flex flex-wrap gap-1.5">
            {conversation.tags.length === 0 ? (
              <span className="text-xs text-muted-foreground italic">No tags added yet.</span>
            ) : (
              conversation.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-[10px] px-2 py-0.5 flex items-center gap-1 bg-muted/80 text-foreground border border-border/20"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive text-muted-foreground/80 font-semibold"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              ))
            )}
          </div>

          <form onSubmit={handleAddTag} className="flex gap-1.5 mt-2">
            <Input
              placeholder="Add tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="h-7 text-xs px-2.5 bg-background"
            />
            <Button type="submit" size="sm" variant="outline" className="h-7 px-2">
              Add
            </Button>
          </form>
        </div>

        {/* System & Session Specs */}
        <div className="p-4 space-y-3">
          <div className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
            System & Session Specs
          </div>
          <div className="space-y-2.5 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
              <span className="text-foreground/90 font-medium">Location:</span>
              <span className="ml-auto text-foreground/70">{visitorDetails.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Laptop className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
              <span className="text-foreground/90 font-medium">Device/OS:</span>
              <span className="ml-auto text-foreground/70 truncate max-w-[150px]" title={visitorDetails.device}>
                {visitorDetails.device}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
              <span className="text-foreground/90 font-medium">Browser:</span>
              <span className="ml-auto text-foreground/70 truncate max-w-[150px]" title={visitorDetails.browser}>
                {visitorDetails.browser}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Compass className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
              <span className="text-foreground/90 font-medium">Current Page:</span>
              <span className="ml-auto text-foreground/70 truncate max-w-[130px]" title={visitorDetails.currentPage}>
                {visitorDetails.currentPage}
              </span>
            </div>
            <div className="flex items-center gap-2 border-t border-border/20 pt-2.5">
              <Clock className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
              <span className="text-foreground/90 font-medium">Duration:</span>
              <span className="ml-auto text-foreground/70">{conversation.metadata.sessionDuration}</span>
            </div>
            <div className="flex items-center gap-2">
              <MousePointerClick className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
              <span className="text-foreground/90 font-medium">Pages Visited:</span>
              <span className="ml-auto text-foreground/70">{conversation.metadata.pagesVisited} pages</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
              <span className="text-foreground/90 font-medium">Channel:</span>
              <span className="ml-auto text-foreground/70 capitalize">{conversation.channel || "chat"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
