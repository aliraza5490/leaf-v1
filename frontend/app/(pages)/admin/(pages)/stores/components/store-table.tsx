"use client";

import { MoreHorizontal, Pencil, Store } from "lucide-react";
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
import type { Store as StoreType } from "@/app/(pages)/admin/types";

interface AdminStoreTableProps {
  stores: StoreType[];
  onEdit: (store: StoreType) => void;
}

function getStatusVariant(status: StoreType["status"]) {
  switch (status) {
    case "active":
      return "default";
    case "suspended":
      return "destructive";
    case "trial":
      return "secondary";
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AdminStoreTable({ stores, onEdit }: AdminStoreTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Store</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Plan</TableHead>
            <TableHead className="text-center">Users</TableHead>
            <TableHead className="text-center">Products</TableHead>
            <TableHead className="text-center">Conversations</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stores.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="h-24 text-center text-muted-foreground"
              >
                No stores found.
              </TableCell>
            </TableRow>
          ) : (
            stores.map((store) => (
              <TableRow key={store.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Store className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{store.name}</span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {store.id}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={getStatusVariant(store.status)}>
                    {store.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">{store.plan}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  {store.user_count ?? 0}
                </TableCell>
                <TableCell className="text-center">
                  {store.product_count ?? 0}
                </TableCell>
                <TableCell className="text-center">
                  {store.conversation_count ?? 0}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(store.created_at)}
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
                      <DropdownMenuItem onClick={() => onEdit(store)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
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
