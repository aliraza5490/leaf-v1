"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { KBHeader } from "@/app/(pages)/dashboard/(pages)/knowledge-base/components/kb-header";
import { KBToolbar } from "@/app/(pages)/dashboard/(pages)/knowledge-base/components/kb-toolbar";
import { KBTable } from "@/app/(pages)/dashboard/(pages)/knowledge-base/components/kb-table";
import { KBGrid } from "@/app/(pages)/dashboard/(pages)/knowledge-base/components/kb-grid";
import { KBArticleFormDialog } from "@/app/(pages)/dashboard/(pages)/knowledge-base/components/kb-article-form-dialog";
import { KBFAQFormDialog } from "@/app/(pages)/dashboard/(pages)/knowledge-base/components/kb-faq-form-dialog";
import { KBDocImportDialog } from "@/app/(pages)/dashboard/(pages)/knowledge-base/components/kb-document-import-dialog";
import { KBURLScrapeDialog } from "@/app/(pages)/dashboard/(pages)/knowledge-base/components/kb-url-scrape-dialog";
import { KBSyncProductsDialog } from "@/app/(pages)/dashboard/(pages)/knowledge-base/components/kb-sync-products-dialog";
import type {
  KBArticle,
  KBArticleFormData,
  KBFilters,
  KBFAQFormData,
  KBViewMode,
} from "@/app/(pages)/dashboard/(pages)/knowledge-base/types";
import { mockArticles } from "@/lib/knowledge-base/mock-data";
import { generateId } from "@/lib/knowledge-base/utils";

export default function KnowledgeBasePage() {
  const [articles, setArticles] = useState<KBArticle[]>(mockArticles);
  const [viewMode, setViewMode] = useState<KBViewMode>("grid");
  const [filters, setFilters] = useState<KBFilters>({
    search: "",
    category: "all",
    contentType: "all",
    source: "all",
    status: "all",
    sortField: "updatedAt",
    sortDirection: "desc",
  });

  const [articleFormOpen, setArticleFormOpen] = useState(false);
  const [faqFormOpen, setFaqFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [scrapeOpen, setScrapeOpen] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<KBArticle | null>(null);

  const filteredArticles = useMemo(() => {
    let result = [...articles];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(search) ||
          a.content.toLowerCase().includes(search) ||
          a.tags.some((t) => t.toLowerCase().includes(search))
      );
    }

    if (filters.category !== "all") {
      result = result.filter((a) => a.category === filters.category);
    }

    if (filters.contentType !== "all") {
      result = result.filter((a) => a.contentType === filters.contentType);
    }

    if (filters.source !== "all") {
      result = result.filter((a) => a.source === filters.source);
    }

    if (filters.status !== "all") {
      result = result.filter((a) => a.status === filters.status);
    }

    result.sort((a, b) => {
      const direction = filters.sortDirection === "asc" ? 1 : -1;
      switch (filters.sortField) {
        case "title":
          return a.title.localeCompare(b.title) * direction;
        case "createdAt":
          return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * direction;
        case "updatedAt":
          return (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) * direction;
        default:
          return 0;
      }
    });

    return result;
  }, [articles, filters]);

  const handleAddArticle = () => {
    setEditingArticle(null);
    setArticleFormOpen(true);
  };

  const handleAddFAQ = () => {
    setEditingArticle(null);
    setFaqFormOpen(true);
  };

  const handleEdit = (article: KBArticle) => {
    setEditingArticle(article);
    if (article.contentType === "faq") {
      setFaqFormOpen(true);
    } else {
      setArticleFormOpen(true);
    }
  };

  const handleDelete = (article: KBArticle) => {
    setArticles((prev) => prev.filter((a) => a.id !== article.id));
    toast.success(`"${article.title}" has been deleted.`);
  };

  const handleSaveArticle = (data: KBArticleFormData) => {
    if (editingArticle) {
      setArticles((prev) =>
        prev.map((a) =>
          a.id === editingArticle.id
            ? {
                ...a,
                ...data,
                updatedAt: new Date().toISOString(),
              }
            : a
        )
      );
      toast.success(`"${data.title}" has been updated.`);
    } else {
      const newArticle: KBArticle = {
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setArticles((prev) => [newArticle, ...prev]);
      toast.success(`"${data.title}" has been added.`);
    }
  };

  const handleSaveFAQ = (data: KBFAQFormData) => {
    if (editingArticle && editingArticle.contentType === "faq") {
      setArticles((prev) =>
        prev.map((a) =>
          a.id === editingArticle.id
            ? {
                ...a,
                ...data,
                title: data.faqQuestion,
                content: data.faqAnswer,
                updatedAt: new Date().toISOString(),
              }
            : a
        )
      );
      toast.success(`FAQ has been updated.`);
    } else {
      const newArticle: KBArticle = {
        id: generateId(),
        title: data.faqQuestion,
        content: data.faqAnswer,
        contentType: "faq",
        category: data.category,
        tags: data.tags,
        status: data.status,
        source: "manual",
        linkedProducts: [],
        faqQuestion: data.faqQuestion,
        faqAnswer: data.faqAnswer,
        icon: data.icon,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setArticles((prev) => [newArticle, ...prev]);
      toast.success(`FAQ has been added.`);
    }
  };

  const handleImportArticles = (importedArticles: KBArticleFormData[]) => {
    const newArticles: KBArticle[] = importedArticles.map((data) => ({
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    setArticles((prev) => [...newArticles, ...prev]);
    toast.success(`${importedArticles.length} article(s) have been imported.`);
  };

  return (
    <div className="flex flex-col gap-6">
      <KBHeader
        onAddArticle={handleAddArticle}
        onAddFAQ={handleAddFAQ}
        onImport={() => setImportOpen(true)}
        onScrapeURL={() => setScrapeOpen(true)}
        onSyncProducts={() => setSyncOpen(true)}
      />

      <KBToolbar
        filters={filters}
        onFiltersChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {viewMode === "table" ? (
        <KBTable
          articles={filteredArticles}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <KBGrid
          articles={filteredArticles}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <KBArticleFormDialog
        open={articleFormOpen}
        onOpenChange={setArticleFormOpen}
        article={editingArticle?.contentType === "article" ? editingArticle : null}
        onSave={handleSaveArticle}
      />

      <KBFAQFormDialog
        open={faqFormOpen}
        onOpenChange={setFaqFormOpen}
        article={editingArticle?.contentType === "faq" ? editingArticle : null}
        onSave={handleSaveFAQ}
      />

      <KBDocImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        onImport={handleImportArticles}
      />

      <KBURLScrapeDialog
        open={scrapeOpen}
        onOpenChange={setScrapeOpen}
        onImport={handleImportArticles}
      />

      <KBSyncProductsDialog
        open={syncOpen}
        onOpenChange={setSyncOpen}
        onImport={handleImportArticles}
      />
    </div>
  );
}
