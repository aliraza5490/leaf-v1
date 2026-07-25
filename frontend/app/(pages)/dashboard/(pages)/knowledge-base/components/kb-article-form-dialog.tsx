"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { KBArticle, KBArticleFormData } from "@/app/(pages)/dashboard/(pages)/knowledge-base/types";
import { kbCategories } from "@/lib/knowledge-base/mock-data";

const articleFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(200),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  tags: z.string(),
  status: z.enum(["active", "draft", "archived"]),
  source: z.enum(["manual", "document", "url", "product-sync"]),
  sourceUrl: z.string().optional(),
  linkedProducts: z.string().optional(),
  icon: z.string().optional(),
});

type ArticleFormValues = z.infer<typeof articleFormSchema>;

interface KBArticleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article: KBArticle | null;
  onSave: (data: KBArticleFormData) => void;
}

export function KBArticleFormDialog({
  open,
  onOpenChange,
  article,
  onSave,
}: KBArticleFormDialogProps) {
  const isEditing = article !== null;

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      tags: "",
      status: "draft",
      source: "manual",
      sourceUrl: "",
      linkedProducts: "",
      icon: "none",
    },
  });

  useEffect(() => {
    if (article) {
      form.reset({
        title: article.title,
        content: article.content,
        category: article.category,
        tags: article.tags.join(", "),
        status: article.status,
        source: article.source,
        sourceUrl: article.sourceUrl || "",
        linkedProducts: article.linkedProducts.join(", "),
        icon: article.icon || "none",
      });
    } else {
      form.reset({
        title: "",
        content: "",
        category: "",
        tags: "",
        status: "draft",
        source: "manual",
        sourceUrl: "",
        linkedProducts: "",
        icon: "none",
      });
    }
  }, [article, form, open]);

  const onSubmit = (data: ArticleFormValues) => {
    const formData: KBArticleFormData = {
      title: data.title,
      content: data.content,
      contentType: "article",
      category: data.category,
      tags: data.tags
        ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      status: data.status,
      source: data.source,
      sourceUrl: data.sourceUrl || undefined,
      linkedProducts: data.linkedProducts
        ? data.linkedProducts.split(",").map((p) => p.trim()).filter(Boolean)
        : [],
      icon: data.icon && data.icon !== "none" ? data.icon : undefined,
    };
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Article" : "Add New Article"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the article information below."
              : "Fill in the article details below to add it to your knowledge base."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter article title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your article content here..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {kbCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visual Card Graphic</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Auto-detect (Default)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Auto-detect (Default)</SelectItem>
                        <SelectItem value="camera">Camera</SelectItem>
                        <SelectItem value="headphones">Headphones</SelectItem>
                        <SelectItem value="watch">Smartwatch</SelectItem>
                        <SelectItem value="shipping">Shipping & Delivery</SelectItem>
                        <SelectItem value="refund">Returns & Refunds</SelectItem>
                        <SelectItem value="policy">Store Policies</SelectItem>
                        <SelectItem value="account">Account & Orders</SelectItem>
                        <SelectItem value="faq">FAQs</SelectItem>
                        <SelectItem value="general">General / Default</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="url">URL</SelectItem>
                        <SelectItem value="product-sync">Product Sync</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Comma-separated tags"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("source") === "url" && (
                <FormField
                  control={form.control}
                  name="sourceUrl"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Source URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/article" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="linkedProducts"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Linked Product IDs</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Comma-separated product IDs (e.g., 1, 2, 3)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? "Save Changes" : "Add Article"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
