"use client";

import { BarChart3, Calendar } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AnalyticsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        </div>
        <p className="text-muted-foreground">
          Deep dive into your AI assistant performance and visitor engagement.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Select defaultValue="30d">
          <SelectTrigger>
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="12m">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
