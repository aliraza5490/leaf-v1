"use client";

import { FileText, FileDown, File } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Conversation } from "@/app/(pages)/dashboard/(pages)/conversations/types";
import { exportAsText, exportAsPDF, exportAsWord } from "@/lib/utils/export";

interface ExportMenuProps {
  conversation: Conversation;
}

export function ExportMenu({ conversation }: ExportMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileDown className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => exportAsPDF(conversation)}>
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportAsText(conversation)}>
          <File className="mr-2 h-4 w-4" />
          Export as Text
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportAsWord(conversation)}>
          <FileText className="mr-2 h-4 w-4" />
          Export as Word
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
