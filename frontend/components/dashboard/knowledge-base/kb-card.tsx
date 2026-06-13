"use client";

import { FileText, Globe, MoreHorizontal, Pencil, RefreshCw, Trash2 } from "lucide-react";
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

export function KBCard({ article, onEdit, onDelete }: KBCardProps) {
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={article.contentType === "faq" ? "default" : "outline"}>
              {article.contentType === "faq" ? "FAQ" : "Article"}
            </Badge>
            <Badge
              className={
                article.status === "active"
                  ? "bg-green-600"
                  : article.status === "draft"
                    ? ""
                    : "border-muted-foreground text-muted-foreground"
              }
              variant={article.status === "archived" ? "outline" : "default"}
            >
              {article.status}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
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
        <CardTitle className="text-base leading-snug">{article.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {article.contentType === "faq" ? article.faqAnswer : article.content}
        </p>
        <div className="flex flex-wrap gap-1">
          {article.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="inline-block rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
          <span>{article.category}</span>
          <div className="flex items-center gap-1">
            {article.source === "url" && <Globe className="h-3 w-3" />}
            {article.source === "document" && <FileText className="h-3 w-3" />}
            {article.source === "product-sync" && <RefreshCw className="h-3 w-3" />}
            <span>{new Date(article.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
