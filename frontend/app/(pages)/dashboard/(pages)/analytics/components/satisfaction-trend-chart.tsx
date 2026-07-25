"use client";

import {
  Bar,
  ComposedChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "Week 1", csat: 4.3, responses: 120 },
  { name: "Week 2", csat: 4.5, responses: 145 },
  { name: "Week 3", csat: 4.4, responses: 162 },
  { name: "Week 4", csat: 4.7, responses: 138 },
  { name: "Week 5", csat: 4.6, responses: 189 },
  { name: "Week 6", csat: 4.8, responses: 156 },
];

export function SatisfactionTrendChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Customer Satisfaction</CardTitle>
        <CardDescription>
          CSAT score trend with response volume
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="name"
              className="text-xs"
              tick={{ fill: "var(--muted-foreground)" }}
            />
            <YAxis
              yAxisId="left"
              domain={[3.5, 5]}
              className="text-xs"
              tick={{ fill: "var(--muted-foreground)" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              className="text-xs"
              tick={{ fill: "var(--muted-foreground)" }}
            />
            <Tooltip
              cursor={{ fill: "var(--muted)", opacity: 0.2 }}
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "var(--radius)",
                color: "var(--card-foreground)",
              }}
              labelStyle={{ color: "var(--card-foreground)", fontWeight: 600 }}
              itemStyle={{ color: "var(--card-foreground)" }}
            />
            <Bar
              yAxisId="right"
              dataKey="responses"
              fill="var(--chart-3)"
              opacity={0.3}
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="csat"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={{ fill: "var(--chart-2)", r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
