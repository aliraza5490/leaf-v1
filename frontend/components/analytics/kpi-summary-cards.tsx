"use client";

import {
  CheckCircle,
  Star,
  Clock,
  MousePointerClick,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const kpis = [
  {
    title: "Resolution Rate",
    value: "92.4%",
    change: "+3.2%",
    trend: "up",
    icon: CheckCircle,
    description: "vs last period",
  },
  {
    title: "CSAT Score",
    value: "4.6/5",
    change: "+0.3",
    trend: "up",
    icon: Star,
    description: "avg rating",
  },
  {
    title: "Avg Session Duration",
    value: "3m 42s",
    change: "-12s",
    trend: "down",
    icon: Clock,
    description: "faster resolution",
  },
  {
    title: "Product Click-Throughs",
    value: "847",
    change: "+18.7%",
    trend: "up",
    icon: MousePointerClick,
    description: "vs last period",
  },
];

export function KpiSummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
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
