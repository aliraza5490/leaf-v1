"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { KBArticleFormData } from "@/app/(pages)/dashboard/(pages)/knowledge-base/types";
import { kbCategories } from "@/mocks/knowledge-base";

interface ScrapedContent {
  url: string;
  title: string;
  content: string;
}

interface KBURLScrapeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (articles: KBArticleFormData[]) => void;
}

export function KBURLScrapeDialog({
  open,
  onOpenChange,
  onImport,
}: KBURLScrapeDialogProps) {
  const [urls, setUrls] = useState("");
  const [category, setCategory] = useState("");
  const [scrapedContents, setScrapedContents] = useState<ScrapedContent[]>([]);
  const [isScraping, setIsScraping] = useState(false);
  const [error, setError] = useState("");

  const handleScrape = () => {
    setError("");
    const urlList = urls
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urlList.length === 0) {
      setError("Please enter at least one URL.");
      return;
    }

    if (!category) {
      setError("Please select a category.");
      return;
    }

    setIsScraping(true);

    setTimeout(() => {
      const mockScraped: ScrapedContent[] = urlList.map((url, i) => {
        const domain = url.replace(/^https?:\/\//, "").split("/")[0];
        return {
          url,
          title: `Content from ${domain} - Page ${i + 1}`,
          content: `This is scraped content from ${url}. The page contains information about products, services, and policies relevant to the store. This content has been automatically extracted and can be edited before saving to the knowledge base.`,
        };
      });
      setScrapedContents(mockScraped);
      setIsScraping(false);
    }, 1500);
  };

  const handleImport = () => {
    const articles: KBArticleFormData[] = scrapedContents.map((sc) => ({
      title: sc.title,
      content: sc.content,
      contentType: "article",
      category,
      tags: ["scraped", "url-import"],
      status: "draft",
      source: "url",
      sourceUrl: sc.url,
      linkedProducts: [],
    }));
    onImport(articles);
    handleClose();
  };

  const handleClose = () => {
    setUrls("");
    setCategory("");
    setScrapedContents([]);
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Scrape Content from URLs</DialogTitle>
          <DialogDescription>
            Enter URLs to scrape content and add it to your knowledge base.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {scrapedContents.length === 0 ? (
            <>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  URLs (one per line)
                </label>
                <Textarea
                  placeholder={"https://example.com/page1\nhttps://example.com/page2"}
                  className="min-h-[120px]"
                  value={urls}
                  onChange={(e) => setUrls(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {kbCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  Scraped {scrapedContents.length} page{scrapedContents.length > 1 ? "s" : ""}
                </span>
                <Badge variant="default">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Ready to import
                </Badge>
              </div>
              {scrapedContents.map((sc, i) => (
                <div key={i} className="rounded-lg border p-3">
                  <p className="mb-1 text-sm font-medium">{sc.title}</p>
                  <p className="mb-2 text-xs text-muted-foreground">{sc.url}</p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {sc.content}
                  </p>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {scrapedContents.length === 0 ? (
            <Button onClick={handleScrape} disabled={isScraping}>
              {isScraping ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <Globe className="mr-2 h-4 w-4" />
                  Scrape URLs
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleImport}>
              Import {scrapedContents.length} Articles
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
