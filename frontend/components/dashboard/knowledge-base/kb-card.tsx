"use client";

import { 
  FileText, Globe, MoreHorizontal, Pencil, RefreshCw, Trash2,
  Camera, Headphones, Watch, Truck, RotateCcw, ShieldCheck, 
  User, HelpCircle, BookOpen, Tag
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { KBArticle } from "@/lib/knowledge-base/types";

interface KBCardProps {
  article: KBArticle;
  onEdit: (article: KBArticle) => void;
  onDelete: (article: KBArticle) => void;
}

function TechGrid() {
  return (
    <svg 
      className="absolute inset-0 h-full w-full stroke-muted-foreground/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]" 
      aria-hidden="true"
    >
      <defs>
        <pattern id="grid-pattern" width="16" height="16" patternUnits="userSpaceOnUse" x="-1" y="-1">
          <path d="M.5 16V.5H16" fill="none" strokeDasharray="1 3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  );
}

function CameraBanner() {
  return (
    <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent flex items-center justify-center border-b">
      <TechGrid />
      <div className="absolute w-20 h-20 rounded-full border border-dashed border-amber-500/20 animate-[spin_40s_linear_infinite]" />
      <div className="absolute w-28 h-28 rounded-full border border-dashed border-amber-500/10 animate-[spin_60s_linear_infinite_reverse]" />
      <div className="absolute w-12 h-12 bg-amber-500/20 rounded-full blur-xl" />
      <div className="relative w-16 h-16 rounded-2xl bg-card/85 backdrop-blur-md border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/5 transition-all duration-300 group-hover:scale-105 group-hover:border-amber-500/50">
        <Camera className="h-6 w-6 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]" strokeWidth={1.8} />
      </div>
    </div>
  );
}

function HeadphonesBanner() {
  return (
    <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent flex items-center justify-center border-b">
      <TechGrid />
      <div className="absolute w-20 h-20 rounded-full border border-dashed border-violet-500/20 animate-[spin_35s_linear_infinite]" />
      <div className="absolute w-12 h-12 bg-violet-500/20 rounded-full blur-xl" />
      <div className="absolute flex items-end gap-1 bottom-2 left-1/2 -translate-x-1/2">
        <div className="w-0.5 h-2 bg-violet-500/30 rounded-full animate-[pulse_1s_infinite_100ms]" />
        <div className="w-0.5 h-4 bg-violet-500/50 rounded-full animate-[pulse_1s_infinite_300ms]" />
        <div className="w-0.5 h-3 bg-violet-500/40 rounded-full animate-[pulse_1s_infinite_200ms]" />
        <div className="w-0.5 h-5 bg-violet-500/60 rounded-full animate-[pulse_1s_infinite_400ms]" />
        <div className="w-0.5 h-3 bg-violet-500/40 rounded-full animate-[pulse_1s_infinite_200ms]" />
        <div className="w-0.5 h-4 bg-violet-500/50 rounded-full animate-[pulse_1s_infinite_300ms]" />
        <div className="w-0.5 h-2 bg-violet-500/30 rounded-full animate-[pulse_1s_infinite_100ms]" />
      </div>
      <div className="relative w-16 h-16 rounded-2xl bg-card/85 backdrop-blur-md border border-violet-500/30 flex items-center justify-center shadow-lg shadow-violet-500/5 transition-all duration-300 group-hover:scale-105 group-hover:border-violet-500/50">
        <Headphones className="h-6 w-6 text-violet-500 drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]" strokeWidth={1.8} />
      </div>
    </div>
  );
}

function SmartWatchBanner() {
  return (
    <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent flex items-center justify-center border-b">
      <TechGrid />
      <div className="absolute w-20 h-20 rounded-full border border-dashed border-emerald-500/20 animate-[spin_45s_linear_infinite_reverse]" />
      <div className="absolute w-12 h-12 bg-emerald-500/20 rounded-full blur-xl" />
      <div className="relative w-16 h-16 rounded-2xl bg-card/85 backdrop-blur-md border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/5 transition-all duration-300 group-hover:scale-105 group-hover:border-emerald-500/50">
        <Watch className="h-[26px] w-[26px] text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" strokeWidth={1.8} />
      </div>
    </div>
  );
}

function ShippingBanner() {
  return (
    <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent flex items-center justify-center border-b">
      <TechGrid />
      <div className="absolute -left-4 w-32 h-0.5 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent top-12 rotate-[-15deg] animate-pulse" />
      <div className="absolute -right-4 w-32 h-0.5 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent bottom-12 rotate-[-15deg] animate-pulse" />
      <div className="absolute w-12 h-12 bg-blue-500/20 rounded-full blur-xl" />
      <div className="relative w-16 h-16 rounded-2xl bg-card/85 backdrop-blur-md border border-blue-500/30 flex items-center justify-center shadow-lg shadow-blue-500/5 transition-all duration-300 group-hover:scale-105 group-hover:border-blue-500/50">
        <Truck className="h-[26px] w-[26px] text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]" strokeWidth={1.8} />
      </div>
    </div>
  );
}

function RefundsBanner() {
  return (
    <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-transparent flex items-center justify-center border-b">
      <TechGrid />
      <div className="absolute w-20 h-20 rounded-full border-2 border-dashed border-rose-500/10 animate-[spin_50s_linear_infinite]" />
      <div className="absolute w-12 h-12 bg-rose-500/20 rounded-full blur-xl" />
      <div className="relative w-16 h-16 rounded-2xl bg-card/85 backdrop-blur-md border border-rose-500/30 flex items-center justify-center shadow-lg shadow-rose-500/5 transition-all duration-300 group-hover:scale-105 group-hover:border-rose-500/50">
        <RotateCcw className="h-[25px] w-[25px] text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]" strokeWidth={1.8} />
      </div>
    </div>
  );
}

function PoliciesBanner() {
  return (
    <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-slate-500/10 via-zinc-500/5 to-transparent flex items-center justify-center border-b">
      <TechGrid />
      <div className="absolute w-24 h-24 border border-slate-500/10 rotate-45 animate-pulse" />
      <div className="absolute w-12 h-12 bg-slate-500/20 rounded-full blur-xl" />
      <div className="relative w-16 h-16 rounded-2xl bg-card/85 backdrop-blur-md border border-slate-500/30 flex items-center justify-center shadow-lg shadow-slate-500/5 transition-all duration-300 group-hover:scale-105 group-hover:border-slate-500/50">
        <ShieldCheck className="h-[24px] w-[24px] text-slate-400 drop-shadow-[0_0_8px_rgba(156,163,175,0.4)]" strokeWidth={1.8} />
      </div>
    </div>
  );
}

function AccountBanner() {
  return (
    <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent flex items-center justify-center border-b">
      <TechGrid />
      <div className="absolute w-20 h-20 rounded-full border border-indigo-500/10 animate-pulse" />
      <div className="absolute w-12 h-12 bg-indigo-500/20 rounded-full blur-xl" />
      <div className="relative w-16 h-16 rounded-2xl bg-card/85 backdrop-blur-md border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/5 transition-all duration-300 group-hover:scale-105 group-hover:border-indigo-500/50">
        <User className="h-[26px] w-[26px] text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]" strokeWidth={1.8} />
      </div>
    </div>
  );
}

function FaqBanner() {
  return (
    <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-fuchsia-500/10 via-pink-500/5 to-transparent flex items-center justify-center border-b">
      <TechGrid />
      <div className="absolute w-20 h-20 rounded-full border border-dashed border-fuchsia-500/20 animate-[spin_30s_linear_infinite]" />
      <div className="absolute w-12 h-12 bg-fuchsia-500/20 rounded-full blur-xl" />
      <div className="relative w-16 h-16 rounded-2xl bg-card/85 backdrop-blur-md border border-fuchsia-500/30 flex items-center justify-center shadow-lg shadow-fuchsia-500/5 transition-all duration-300 group-hover:scale-105 group-hover:border-fuchsia-500/50">
        <HelpCircle className="h-[24px] w-[24px] text-fuchsia-500 drop-shadow-[0_0_8px_rgba(217,70,239,0.4)]" strokeWidth={1.8} />
      </div>
    </div>
  );
}

function DefaultBanner() {
  return (
    <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-sky-500/10 via-indigo-500/5 to-transparent flex items-center justify-center border-b">
      <TechGrid />
      <div className="absolute w-20 h-20 border border-dashed border-sky-500/10 rotate-12 animate-pulse" />
      <div className="absolute w-12 h-12 bg-sky-500/20 rounded-full blur-xl" />
      <div className="relative w-16 h-16 rounded-2xl bg-card/85 backdrop-blur-md border border-sky-500/30 flex items-center justify-center shadow-lg shadow-sky-500/5 transition-all duration-300 group-hover:scale-105 group-hover:border-sky-500/50">
        <BookOpen className="h-6 w-6 text-sky-500 drop-shadow-[0_0_8px_rgba(14,165,233,0.4)]" strokeWidth={1.8} />
      </div>
    </div>
  );
}

function KBCardBanner({ article }: { article: KBArticle }) {
  if (article.icon) {
    switch (article.icon) {
      case "camera":
        return <CameraBanner />;
      case "headphones":
        return <HeadphonesBanner />;
      case "watch":
        return <SmartWatchBanner />;
      case "shipping":
        return <ShippingBanner />;
      case "refund":
        return <RefundsBanner />;
      case "policy":
        return <PoliciesBanner />;
      case "account":
        return <AccountBanner />;
      case "faq":
        return <FaqBanner />;
      case "general":
        return <DefaultBanner />;
    }
  }

  const titleLower = article.title.toLowerCase();
  const tagsLower = article.tags.map(t => t.toLowerCase());
  const categoryLower = article.category.toLowerCase();
  const isFaq = article.contentType === "faq" || categoryLower === "faqs";

  if (tagsLower.includes("camera") || titleLower.includes("camera")) {
    return <CameraBanner />;
  }
  if (tagsLower.includes("headphones") || titleLower.includes("headphones")) {
    return <HeadphonesBanner />;
  }
  if (tagsLower.includes("smartwatch") || tagsLower.includes("fitness") || titleLower.includes("watch")) {
    return <SmartWatchBanner />;
  }
  if (categoryLower.includes("shipping") || categoryLower.includes("delivery")) {
    return <ShippingBanner />;
  }
  if (categoryLower.includes("return") || categoryLower.includes("refund")) {
    return <RefundsBanner />;
  }
  if (categoryLower.includes("policy") || categoryLower.includes("legal") || categoryLower.includes("terms") || categoryLower.includes("privacy")) {
    return <PoliciesBanner />;
  }
  if (categoryLower.includes("account") || categoryLower.includes("order")) {
    return <AccountBanner />;
  }
  if (isFaq) {
    return <FaqBanner />;
  }
  return <DefaultBanner />;
}

export function KBCard({ article, onEdit, onDelete }: KBCardProps) {
  return (
    <Card className="group relative overflow-hidden flex flex-col h-full hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-2xl hover:border-primary/30 transition-all duration-300 bg-card pt-0!">
      <div className="relative">
        <KBCardBanner article={article} />
        
        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10 pointer-events-none">
          <Badge 
            variant="outline"
            className={
              article.contentType === "faq" 
                ? "bg-purple-500/10 text-purple-500 border-purple-500/30 backdrop-blur-md" 
                : "bg-blue-500/10 text-blue-500 border-blue-500/30 backdrop-blur-md"
            }
          >
            {article.contentType === "faq" ? "FAQ" : "Article"}
          </Badge>
          
          <Badge
            className={
              article.status === "active"
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30 backdrop-blur-md flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                : article.status === "draft"
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/30 backdrop-blur-md flex items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.1)]"
                  : "bg-muted/30 text-muted-foreground border-muted-foreground/30 backdrop-blur-md flex items-center gap-1.5"
            }
            variant="outline"
          >
            {article.status === "active" && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
            )}
            {article.status === "draft" && (
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            )}
            {article.status === "archived" && (
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
            )}
            <span className="capitalize">{article.status}</span>
          </Badge>
        </div>

        {/* Dropdown Menu overlay */}
        <div className="absolute top-2 right-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-card/65 border border-muted/20 hover:bg-muted/80 backdrop-blur-md rounded-lg">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(article)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(article)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-base font-semibold leading-snug group-hover:text-primary transition-colors duration-200">
          {article.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 flex flex-col justify-between flex-grow">
        <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
          {article.contentType === "faq" ? article.faqAnswer : article.content}
        </p>
        
        <div className="space-y-3 pt-2">
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {article.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-xs text-muted-foreground border border-transparent hover:border-muted-foreground/20 hover:bg-muted transition-colors duration-200"
                >
                  <Tag className="h-2.5 w-2.5 opacity-60" />
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/75">{article.category}</span>
            <div className="flex items-center gap-1.5">
              {article.source === "url" && <Globe className="h-3 w-3 text-sky-500" />}
              {article.source === "document" && <FileText className="h-3 w-3 text-amber-500" />}
              {article.source === "product-sync" && <RefreshCw className="h-3 w-3 text-emerald-500" />}
              <span>{new Date(article.updatedAt).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
