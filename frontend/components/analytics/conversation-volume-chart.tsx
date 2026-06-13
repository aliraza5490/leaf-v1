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
  { name: "Week 1", total: 320, resolved: 295, escalated: 25 },
  { name: "Week 2", total: 380, resolved: 352, escalated: 28 },
  { name: "Week 3", total: 410, resolved: 385, escalated: 25 },
  { name: "Week 4", total: 365, resolved: 340, escalated: 25 },
];

export function ConversationVolumeChart() {
  const chart1 = useCssVariable("--chart-1");
  const chart2 = useCssVariable("--chart-2");
  const chart4 = useCssVariable("--chart-4");
  const mutedForeground = useCssVariable("--muted-foreground");
  const card = useCssVariable("--card");
  const border = useCssVariable("--border");
  const radius = useCssVariable("--radius");

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Conversation Volume</CardTitle>
        <CardDescription>
          Total, resolved, and escalated conversations over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chart1} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chart1} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorResolvedVol" x1="0" y1="0" x2="0" y2="1">
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
              dataKey="total"
              stroke={chart1}
              fillOpacity={1}
              fill="url(#colorTotal)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="resolved"
              stroke={chart2}
              fillOpacity={1}
              fill="url(#colorResolvedVol)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="escalated"
              stroke={chart4}
              fillOpacity={0.1}
              fill={chart4}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
