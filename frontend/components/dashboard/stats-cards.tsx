"use client";

import { MessageSquare, Users, TrendingUp, Clock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Total Conversations",
    value: "2,543",
    change: "+12.5%",
    trend: "up",
    icon: MessageSquare,
    description: "vs last month",
  },
  {
    title: "Active Visitors",
    value: "1,234",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    description: "currently online",
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: "+2.1%",
    trend: "up",
    icon: TrendingUp,
    description: "vs last month",
  },
  {
    title: "Avg. Response Time",
    value: "1.2s",
    change: "-15%",
    trend: "down",
    icon: Clock,
    description: "improvement",
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
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
