"use client";

import { FileText, Globe, MoreHorizontal, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { KBArticle } from "@/app/(pages)/dashboard/(pages)/knowledge-base/types";

interface KBTableProps {
  articles: KBArticle[];
  onEdit: (article: KBArticle) => void;
  onDelete: (article: KBArticle) => void;
}

function SourceBadge({ source, sourceFile }: { source: string; sourceFile?: string }) {
  switch (source) {
    case "url":
      return (
        <Badge variant="outline" className="gap-1">
          <Globe className="h-3 w-3" />
          URL
        </Badge>
      );
    case "document":
      return (
        <Badge variant="outline" className="gap-1">
          <FileText className="h-3 w-3" />
          {sourceFile || "Document"}
        </Badge>
      );
    case "product-sync":
      return (
        <Badge variant="outline" className="gap-1">
          <RefreshCw className="h-3 w-3" />
          Product
        </Badge>
      );
    default:
      return <Badge variant="secondary">Manual</Badge>;
  }
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "active":
      return <Badge className="bg-green-600">Active</Badge>;
    case "draft":
      return <Badge variant="secondary">Draft</Badge>;
    case "archived":
      return <Badge variant="outline">Archived</Badge>;
    default:
      return null;
  }
}

export function KBTable({ articles, onEdit, onDelete }: KBTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                No articles found.
              </TableCell>
            </TableRow>
          ) : (
            articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{article.title}</div>
                    {article.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-block rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                        {article.tags.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{article.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={article.contentType === "faq" ? "default" : "outline"}>
                    {article.contentType === "faq" ? "FAQ" : "Article"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{article.category}</TableCell>
                <TableCell>
                  <SourceBadge
                    source={article.source}
                    sourceFile={article.sourceFile}
                  />
                </TableCell>
                <TableCell>
                  <StatusBadge status={article.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(article.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
