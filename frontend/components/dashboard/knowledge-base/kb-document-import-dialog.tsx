"use client";

import { useCallback, useState } from "react";
import { AlertCircle, CheckCircle2, Download, FileText, Upload } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { KBArticleFormData, KBImportPreview } from "@/lib/knowledge-base/types";
import {
  downloadFile,
  generateCSVTemplate,
  generateJSONTemplate,
  mapImportToArticle,
  parseCSV,
  validateArticleData,
} from "@/lib/knowledge-base/utils";

interface KBDocImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (articles: KBArticleFormData[]) => void;
}

export function KBDocImportDialog({
  open,
  onOpenChange,
  onImport,
}: KBDocImportDialogProps) {
  const [preview, setPreview] = useState<KBImportPreview | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [parseError, setParseError] = useState<string>("");

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setFileName(file.name);
      setParseError("");
      setPreview(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const extension = file.name.split(".").pop()?.toLowerCase();

          let parsedData: Record<string, unknown>[];

          if (extension === "csv") {
            parsedData = parseCSV(content);
          } else if (extension === "json") {
            parsedData = JSON.parse(content);
          } else {
            setParseError("Unsupported file format. Please use CSV or JSON.");
            return;
          }

          if (!Array.isArray(parsedData) || parsedData.length === 0) {
            setParseError("No data found in file.");
            return;
          }

          const articles: KBArticleFormData[] = [];
          const errors: string[][] = [];

          parsedData.forEach((row) => {
            const rowErrors = validateArticleData(row);
            if (rowErrors.length > 0) {
              errors.push(rowErrors);
            } else {
              articles.push(mapImportToArticle(row as Record<string, string>));
            }
          });

          setPreview({ data: articles, errors });
        } catch {
          setParseError("Failed to parse file. Please check the format.");
        }
      };
      reader.readAsText(file);
    },
    []
  );

  const handleImport = () => {
    if (preview && preview.data.length > 0) {
      onImport(preview.data);
      handleClose();
    }
  };

  const handleClose = () => {
    setPreview(null);
    setFileName("");
    setParseError("");
    onOpenChange(false);
  };

  const handleDownloadCSV = () => {
    const template = generateCSVTemplate();
    downloadFile(template, "kb-template.csv", "text/csv");
  };

  const handleDownloadJSON = () => {
    const template = generateJSONTemplate();
    downloadFile(template, "kb-template.json", "application/json");
  };

  const totalErrors = preview?.errors.reduce((sum, errs) => sum + errs.length, 0) || 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Import Knowledge Base Articles</DialogTitle>
          <DialogDescription>
            Upload a CSV or JSON file to bulk import articles into your knowledge base.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-dashed p-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">Upload your knowledge file</p>
              <p className="text-xs text-muted-foreground">
                Supports CSV and JSON formats
              </p>
              <input
                type="file"
                accept=".csv,.json"
                onChange={handleFileChange}
                className="mt-2 text-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadCSV}
            >
              <Download className="mr-2 h-4 w-4" />
              CSV Template
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadJSON}
            >
              <Download className="mr-2 h-4 w-4" />
              JSON Template
            </Button>
          </div>

          {parseError && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p className="text-sm">{parseError}</p>
            </div>
          )}

          {preview && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{fileName}</span>
                </div>
                <div className="flex items-center gap-2">
                  {preview.data.length > 0 && (
                    <Badge variant="default">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      {preview.data.length} valid
                    </Badge>
                  )}
                  {totalErrors > 0 && (
                    <Badge variant="destructive">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      {totalErrors} errors
                    </Badge>
                  )}
                </div>
              </div>

              {preview.data.length > 0 && (
                <div className="max-h-[200px] overflow-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Tags</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {preview.data.slice(0, 5).map((article, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">
                            {article.title}
                          </TableCell>
                          <TableCell>{article.category}</TableCell>
                          <TableCell>{article.tags.join(", ")}</TableCell>
                        </TableRow>
                      ))}
                      {preview.data.length > 5 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground">
                            + {preview.data.length - 5} more articles
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}

              {preview.errors.length > 0 && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-3">
                  <p className="mb-2 text-sm font-medium text-destructive">
                    Validation Errors:
                  </p>
                  <ul className="space-y-1 text-xs text-destructive">
                    {preview.errors.slice(0, 3).map((errs, i) => (
                      <li key={i}>Row {i + 1}: {errs.join(", ")}</li>
                    ))}
                    {preview.errors.length > 3 && (
                      <li>...and {preview.errors.length - 3} more rows with errors</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={!preview || preview.data.length === 0}
          >
            Import {preview?.data.length || 0} Articles
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
