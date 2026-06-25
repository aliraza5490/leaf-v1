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
import { useCssVariable } from "@/hooks/use-css-variable";
import { useConversationTrends } from "@/hooks/use-conversation-stats";

export function ConversationChart() {
  const chart1 = useCssVariable("--chart-1");
  const chart2 = useCssVariable("--chart-2");
  const mutedForeground = useCssVariable("--muted-foreground");
  const card = useCssVariable("--card");
  const border = useCssVariable("--border");
  const radius = useCssVariable("--radius");

  const { trends } = useConversationTrends(7);

  const data = trends?.trends.map((t) => ({
    name: new Date(t.date).toLocaleDateString("en-US", { weekday: "short" }),
    conversations: t.conversations,
    resolved: t.resolved,
  })) ?? [];

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Conversation Trends</CardTitle>
        <CardDescription>
          Total conversations vs resolved this week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ left: -20 }}>
            <defs>
              <linearGradient id="colorConversations" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chart1} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chart1} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chart2} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chart2} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={border} />
            <XAxis
              dataKey="name"
              className="text-xs"
              tick={{ fill: mutedForeground }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: mutedForeground }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: card,
                border: `1px solid ${border}`,
                borderRadius: radius,
              }}
            />
            <Area
              type="monotone"
              dataKey="conversations"
              stroke={chart1}
              fillOpacity={1}
              fill="url(#colorConversations)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="resolved"
              stroke={chart2}
              fillOpacity={1}
              fill="url(#colorResolved)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
