"use client";

import { MessageSquare, Users, TrendingUp, Clock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConversationStats } from "@/hooks/use-conversation-stats";

export function StatsCards() {
  const { stats, loading } = useConversationStats();

  const statsData = [
    {
      title: "Total Conversations",
      value: loading ? "..." : String(stats?.total ?? 0),
      change: "+12.5%",
      trend: "up",
      icon: MessageSquare,
      description: "vs last month",
    },
    {
      title: "Active Conversations",
      value: loading ? "..." : String(stats?.active ?? 0),
      change: "+8.2%",
      trend: "up",
      icon: Users,
      description: "currently active",
    },
    {
      title: "Conversion Rate",
      value: loading ? "..." : stats?.conversionRate ?? "0%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      description: "vs last month",
    },
    {
      title: "Avg. Response Time",
      value: loading ? "..." : stats?.avgResponseTime ?? "0s",
      change: "-15%",
      trend: "down",
      icon: Clock,
      description: "improvement",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  stat.trend === "up"
                    ? "text-chart-2"
                    : "text-chart-1"
                }
              >
                {stat.change}
              </span>{" "}
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
