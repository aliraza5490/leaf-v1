import type { KBArticleFormData } from "@/types";

export function generateId(): string {
  return `kb-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });
    rows.push(row);
  }

  return rows;
}

export function validateArticleData(row: Record<string, unknown>): string[] {
  const errors: string[] = [];

  if (!row.title || typeof row.title !== "string" || row.title.trim().length < 2) {
    errors.push("Title is required (min 2 characters)");
  }

  if (!row.content || typeof row.content !== "string" || row.content.trim().length < 10) {
    errors.push("Content is required (min 10 characters)");
  }

  if (!row.category || typeof row.category !== "string" || row.category.trim().length === 0) {
    errors.push("Category is required");
  }

  return errors;
}

export function mapImportToArticle(row: Record<string, string>): KBArticleFormData {
  return {
    title: row.title || "",
    content: row.content || "",
    contentType: "article",
    category: row.category || "",
    tags: row.tags ? row.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    status: "draft",
    source: "document",
    linkedProducts: [],
  };
}

export function generateCSVTemplate(): string {
  const headers = ["title", "content", "category", "tags"];
  const example = [
    "Shipping Policy",
    "We offer free shipping on orders over $50. Delivery takes 3-5 business days.",
    "Policies",
    "shipping,delivery",
  ];
  return [headers.join(","), example.map((v) => `"${v}"`).join(",")].join("\n");
}

export function generateJSONTemplate(): string {
  const template = [
    {
      title: "Shipping Policy",
      content: "We offer free shipping on orders over $50. Delivery takes 3-5 business days.",
      category: "Policies",
      tags: "shipping,delivery",
    },
  ];
  return JSON.stringify(template, null, 2);
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
