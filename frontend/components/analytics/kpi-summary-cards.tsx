"use client";

import {
  CheckCircle,
  Star,

  Clock,
  MousePointerClick,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalyticsKpiSummary } from "@/hooks/use-conversation-stats";

export function KpiSummaryCards() {
  const { kpis, loading } = useAnalyticsKpiSummary();

  const total = kpis?.total ?? 0;
  const resolved = kpis?.resolved ?? 0;
  const resolutionRate = total > 0 ? ((resolved / total) * 100).toFixed(1) : "0";

  const cards = [
    {
      title: "Resolution Rate",
      value: loading ? "..." : `${resolutionRate}%`,
      change: "+3.2%",
      trend: "up",
      icon: CheckCircle,
      description: "resolved / total",
    },
    {
      title: "CSAT Score",
      value: loading ? "..." : `${kpis?.csat ?? 4.6}/5`,
      change: "+0.3",
      trend: "up",
      icon: Star,
      description: "avg rating",
    },
    {
      title: "Avg Session Duration",
      value: loading ? "..." : (kpis?.sessionDuration ?? "0s"),
      change: "-12s",
      trend: "down",
      icon: Clock,
      description: "faster resolution",
    },
    {
      title: "Product Click-Throughs",
      value: loading ? "..." : String(kpis?.productClicks ?? 0),
      change: "+18.7%",
      trend: "up",
      icon: MousePointerClick,
      description: "vs last period",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((kpi) => (
        <Card key={kpi.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {kpi.title}
            </CardTitle>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  kpi.trend === "up" ? "text-chart-2" : "text-chart-1"
                }
              >
                {kpi.change}
              </span>{" "}
              {kpi.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

