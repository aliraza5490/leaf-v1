"use client";

import { useRouter } from "next/navigation";
import { MessageSquare, Package, BookOpen, Settings } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      title: "New Conversation",
      description: "Start a chat with a visitor",
      icon: MessageSquare,
      action: () => router.push("/dashboard/conversations"),
    },
    {
      title: "Add Product",
      description: "Add a new product to catalog",
      icon: Package,
      action: () => router.push("/dashboard/products"),
    },
    {
      title: "Update Knowledge",
      description: "Edit knowledge base articles",
      icon: BookOpen,
      action: () => router.push("/dashboard/knowledge-base"),
    },
    {
      title: "Configure AI",
      description: "Adjust AI assistant settings",
      icon: Settings,
      action: () => {},
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant="ghost"
            className="justify-start gap-3 h-auto py-3 px-3"
            onClick={action.action}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <action.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-medium">{action.title}</span>
              <span className="text-xs text-muted-foreground">
                {action.description}
              </span>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
