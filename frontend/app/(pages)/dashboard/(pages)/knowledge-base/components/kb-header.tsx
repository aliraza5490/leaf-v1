"use client";

import { ChevronDown, Globe, Plus, RefreshCw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface KBHeaderProps {
  onAddArticle: () => void;
  onAddFAQ: () => void;
  onImport: () => void;
  onScrapeURL: () => void;
  onSyncProducts: () => void;
}

export function KBHeader({
  onAddArticle,
  onAddFAQ,
  onImport,
  onScrapeURL,
  onSyncProducts,
}: KBHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
        <p className="text-muted-foreground">
          Manage articles, FAQs, and knowledge sources for your AI assistant.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onImport}>
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              More
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onScrapeURL}>
              <Globe className="mr-2 h-4 w-4" />
              Scrape URL
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSyncProducts}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Products
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onAddArticle}>Article</DropdownMenuItem>
            <DropdownMenuItem onClick={onAddFAQ}>FAQ</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
