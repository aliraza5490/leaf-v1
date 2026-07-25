"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import type { Product } from "@/lib/products/types";
import { formatPrice, formatDate, getStockStatusLabel, getStockStatus } from "@/lib/products/utils";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
  const getStatusVariant = (status: Product["status"]) => {
    switch (status) {
      case "active":
        return "default";
      case "draft":
        return "secondary";
      case "archived":
        return "outline";
    }
  };

  const getStockVariant = (stock: number) => {
    const status = getStockStatus(stock);
    switch (status) {
      case "in-stock":
        return "default";
      case "low-stock":
        return "destructive";
      case "out-of-stock":
        return "outline";
    }
  };

  return (
    <div className="rounded-md border min-w-0 w-full overflow-hidden">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Image</TableHead>
            <TableHead className="min-w-[180px]">Name</TableHead>
            <TableHead className="w-[120px]">SKU</TableHead>
            <TableHead className="w-[140px]">Category</TableHead>
            <TableHead className="w-[90px] text-right">Price</TableHead>
            <TableHead className="w-[130px] text-center">Stock</TableHead>
            <TableHead className="w-[100px] text-center">Status</TableHead>
            <TableHead className="w-[110px]">Created</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                No products found.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="h-10 w-10 overflow-hidden rounded-md bg-muted">
                    {product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <span className="text-xs">No img</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="max-w-[260px] truncate font-medium" title={product.name}>
                  {product.name}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{product.sku}</TableCell>
                <TableCell className="max-w-[140px] truncate">{product.category}</TableCell>
                <TableCell className="text-right">{formatPrice(product.price)}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={getStockVariant(product.stock)}>
                    {getStockStatusLabel(product.stock)} ({product.stock})
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={getStatusVariant(product.status)}>
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDate(product.createdAt)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(product)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(product)}
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
