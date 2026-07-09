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
import type { KBArticle, KBFAQFormData } from "@/lib/knowledge-base/types";
import { kbCategories } from "@/lib/knowledge-base/mock-data";

const faqFormSchema = z.object({
  faqQuestion: z.string().min(5, "Question must be at least 5 characters").max(300),
  faqAnswer: z.string().min(10, "Answer must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  tags: z.string(),
  status: z.enum(["active", "draft", "archived"]),
  icon: z.string().optional(),
});

type FAQFormValues = z.infer<typeof faqFormSchema>;

interface KBFAQFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article: KBArticle | null;
  onSave: (data: KBFAQFormData) => void;
}

export function KBFAQFormDialog({
  open,
  onOpenChange,
  article,
  onSave,
}: KBFAQFormDialogProps) {
  const isEditing = article !== null && article.contentType === "faq";

  const form = useForm<FAQFormValues>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      faqQuestion: "",
      faqAnswer: "",
      category: "",
      tags: "",
      status: "draft",
      icon: "none",
    },
  });

  useEffect(() => {
    if (article && article.contentType === "faq") {
      form.reset({
        faqQuestion: article.faqQuestion || "",
        faqAnswer: article.faqAnswer || "",
        category: article.category,
        tags: article.tags.join(", "),
        status: article.status,
        icon: article.icon || "none",
      });
    } else {
      form.reset({
        faqQuestion: "",
        faqAnswer: "",
        category: "",
        tags: "",
        status: "draft",
        icon: "none",
      });
    }
  }, [article, form, open]);

  const onSubmit = (data: FAQFormValues) => {
    const formData: KBFAQFormData = {
      faqQuestion: data.faqQuestion,
      faqAnswer: data.faqAnswer,
      category: data.category,
      tags: data.tags
        ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      status: data.status,
      icon: data.icon && data.icon !== "none" ? data.icon : undefined,
    };
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the FAQ entry below."
              : "Create a new question-answer pair for your knowledge base."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="faqQuestion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the question" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="faqAnswer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write the answer here..."
                      className="min-h-[120px]"
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
                  <FormItem className="sm:col-span-2">
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
                name="tags"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Comma-separated tags (e.g., faq, shipping)"
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
                {isEditing ? "Save Changes" : "Add FAQ"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
