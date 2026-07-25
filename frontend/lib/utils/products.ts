import type { Product, ProductFormData } from "@/types";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getStockStatus(stock: number): "in-stock" | "low-stock" | "out-of-stock" {
  if (stock === 0) return "out-of-stock";
  if (stock < 10) return "low-stock";
  return "in-stock";
}

export function getStockStatusLabel(stock: number): string {
  const status = getStockStatus(stock);
  switch (status) {
    case "out-of-stock":
      return "Out of Stock";
    case "low-stock":
      return "Low Stock";
    case "in-stock":
      return "In Stock";
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const results: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const obj: Record<string, string> = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || "";
    });
    results.push(obj);
  }

  return results;
}

export function productsToCSV(products: Product[]): string {
  const headers = ["name", "description", "price", "sku", "category", "tags", "stock", "status"];
  const rows = products.map((p) => [
    p.name,
    p.description,
    p.price.toString(),
    p.sku,
    p.category,
    p.tags.join("; "),
    p.stock.toString(),
    p.status,
  ]);

  return [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");
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

export function generateCSVTemplate(): string {
  const headers = ["name", "description", "price", "sku", "category", "tags", "stock", "status"];
  const example = [
    "Product Name",
    "Product description here",
    "29.99",
    "SKU-001",
    "Category",
    "tag1; tag2; tag3",
    "100",
    "active",
  ];
  return [headers.join(","), example.map((v) => `"${v}"`).join(",")].join("\n");
}

export function generateJSONTemplate(): string {
  const template = [
    {
      name: "Product Name",
      description: "Product description here",
      price: 29.99,
      sku: "SKU-001",
      category: "Category",
      tags: ["tag1", "tag2", "tag3"],
      stock: 100,
      status: "active",
    },
  ];
  return JSON.stringify(template, null, 2);
}

export function validateProductData(data: Record<string, unknown>): string[] {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== "string" || data.name.length < 2) {
    errors.push("Name is required and must be at least 2 characters");
  }
  if (!data.price || isNaN(Number(data.price)) || Number(data.price) <= 0) {
    errors.push("Price is required and must be a positive number");
  }
  if (!data.sku || typeof data.sku !== "string") {
    errors.push("SKU is required");
  }
  if (!data.category || typeof data.category !== "string") {
    errors.push("Category is required");
  }
  if (data.stock !== undefined && (isNaN(Number(data.stock)) || Number(data.stock) < 0)) {
    errors.push("Stock must be a non-negative number");
  }
  if (data.status && !["active", "draft", "archived"].includes(data.status as string)) {
    errors.push("Status must be active, draft, or archived");
  }

  return errors;
}

export function mapImportToProduct(data: Record<string, string>): ProductFormData {
  return {
    name: data.name || "",
    description: data.description || "",
    price: parseFloat(data.price) || 0,
    sku: data.sku || "",
    category: data.category || "",
    tags: data.tags ? data.tags.split(";").map((t) => t.trim()).filter(Boolean) : [],
    images: [],
    stock: parseInt(data.stock) || 0,
    status: (data.status as "active" | "draft" | "archived") || "draft",
  };
}
