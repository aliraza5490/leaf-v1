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

const data = [
  { name: "Mon", conversations: 120, resolved: 98 },
  { name: "Tue", conversations: 145, resolved: 120 },
  { name: "Wed", conversations: 162, resolved: 135 },
  { name: "Thu", conversations: 138, resolved: 112 },
  { name: "Fri", conversations: 189, resolved: 156 },
  { name: "Sat", conversations: 98, resolved: 82 },
  { name: "Sun", conversations: 76, resolved: 64 },
];

export function ConversationChart() {
  const chart1 = useCssVariable("--chart-1");
  const chart2 = useCssVariable("--chart-2");
  const mutedForeground = useCssVariable("--muted-foreground");
  const card = useCssVariable("--card");
  const border = useCssVariable("--border");
  const radius = useCssVariable("--radius");

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
          <AreaChart data={data}>
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
