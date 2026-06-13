"use client";

import { StatsCards } from "@/components/dashboard/stats-cards";
import { ConversationChart } from "@/components/dashboard/conversation-chart";
import { VisitorChart } from "@/components/dashboard/visitor-chart";
import { RecentConversations } from "@/components/dashboard/recent-conversations";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>
      </div>

      <StatsCards />

      <div className="grid gap-4 md:grid-cols-7">
        <ConversationChart />
        <VisitorChart />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="col-span-2">
          <RecentConversations />
        </div>
        <QuickActions />
      </div>
    </div>
  );
}
