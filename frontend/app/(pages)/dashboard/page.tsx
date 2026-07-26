import { StatsCards } from "@/app/(pages)/dashboard/components/stats-cards";
import { ConversationChart } from "@/app/(pages)/dashboard/components/conversation-chart";
import { VisitorChart } from "@/app/(pages)/dashboard/components/visitor-chart";
import { RecentConversations } from "@/app/(pages)/dashboard/components/recent-conversations";
import { QuickActions } from "@/app/(pages)/dashboard/components/quick-actions";

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

      <div className="grid gap-4 md:grid-cols-7">
        <RecentConversations className="md:col-span-5" />
        <QuickActions className="md:col-span-2" />
      </div>
    </div>
  );
}
