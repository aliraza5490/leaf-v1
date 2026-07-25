"use client";

import { useState } from "react";
import { CheckCircle2, Package, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import type { KBArticleFormData } from "@/app/(pages)/dashboard/(pages)/knowledge-base/types";
import { mockProducts } from "@/mocks/products-data";

interface KBSyncProductsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (articles: KBArticleFormData[]) => void;
}

export function KBSyncProductsDialog({
  open,
  onOpenChange,
  onImport,
}: KBSyncProductsDialogProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const handleToggleProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === mockProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(mockProducts.map((p) => p.id));
    }
  };

  const handleImport = () => {
    const articles: KBArticleFormData[] = selectedProducts.map((productId) => {
      const product = mockProducts.find((p) => p.id === productId);
      if (!product) return null;
      return {
        title: `${product.name} - Product Guide`,
        content: `${product.description}\n\nPrice: $${product.price.toFixed(2)}\nSKU: ${product.sku}\nCategory: ${product.category}\nStock: ${product.stock} units available\n\nTags: ${product.tags.join(", ")}`,
        contentType: "article",
        category: "Product Guides",
        tags: [...product.tags, "product-guide", "auto-generated"],
        status: "draft",
        source: "product-sync",
        linkedProducts: [product.id],
      };
    }).filter((a): a is KBArticleFormData => a !== null);

    onImport(articles);
    handleClose();
  };

  const handleClose = () => {
    setSelectedProducts([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Sync Products to Knowledge Base</DialogTitle>
          <DialogDescription>
            Select products to auto-generate knowledge base articles from their descriptions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {mockProducts.length} products available
              </span>
            </div>
            {selectedProducts.length > 0 && (
              <Badge variant="default">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                {selectedProducts.length} selected
              </Badge>
            )}
          </div>

          <div className="max-h-[350px] overflow-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedProducts.length === mockProducts.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => handleToggleProduct(product.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {product.category}
                    </TableCell>
                    <TableCell className="text-right">
                      ${product.price.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={selectedProducts.length === 0}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync {selectedProducts.length} Product{selectedProducts.length !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
