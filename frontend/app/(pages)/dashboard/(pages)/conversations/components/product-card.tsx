"use client";

import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ConversationProduct } from "@/app/(pages)/dashboard/(pages)/conversations/types";

interface ProductCardProps {
  product: ConversationProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="mt-2 flex gap-3 rounded-lg border border-border/40 bg-card p-3 max-w-[280px]">
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-between min-w-0">
        <div>
          <p className="text-sm font-medium truncate">{product.title}</p>
          <p className="text-sm font-semibold text-primary">
            ${product.price.toFixed(2)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted-foreground">
              {product.rating}
            </span>
          </div>
          <Button size="sm" variant="outline" className="h-6 text-xs px-2">
            View
          </Button>
        </div>
      </div>
    </div>
  );
}
