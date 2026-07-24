"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useConversationTrends } from "@/hooks/use-conversation-stats";

export function ConversationVolumeChart() {
  const { trends } = useConversationTrends(30);

  const data = trends?.trends.map((t) => ({
    name: new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    total: t.conversations,
    resolved: t.resolved,
  })) ?? [];

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Conversation Volume</CardTitle>
        <CardDescription>
          Total and resolved conversations over the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ left: -20 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorResolvedVol" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="name"
              className="text-xs"
              tick={{ fill: "var(--muted-foreground)" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "var(--muted-foreground)" }}
            />
            <Tooltip
              cursor={{ stroke: "var(--border)", strokeDasharray: "3 3" }}
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "var(--radius)",
                color: "var(--card-foreground)",
              }}
              labelStyle={{ color: "var(--card-foreground)", fontWeight: 600 }}
              itemStyle={{ color: "var(--card-foreground)" }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="var(--chart-1)"
              fillOpacity={1}
              fill="url(#colorTotal)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="resolved"
              stroke="var(--chart-2)"
              fillOpacity={1}
              fill="url(#colorResolvedVol)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
