"use client";

import type { KBArticle } from "@/lib/knowledge-base/types";
import { KBCard } from "./kb-card";

interface KBGridProps {
  articles: KBArticle[];
  onEdit: (article: KBArticle) => void;
  onDelete: (article: KBArticle) => void;
}

export function KBGrid({ articles, onEdit, onDelete }: KBGridProps) {
  if (articles.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border text-muted-foreground">
        No articles found.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <KBCard
          key={article.id}
          article={article}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
