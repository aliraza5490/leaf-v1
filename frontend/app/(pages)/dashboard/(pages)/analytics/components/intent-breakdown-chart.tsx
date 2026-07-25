"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "Product Inquiry", count: 1245 },
  { name: "Order Support", count: 832 },
  { name: "Returns & Refunds", count: 421 },
  { name: "General FAQ", count: 687 },
  { name: "Recommendations", count: 534 },
];

export function IntentBreakdownChart() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Intent Breakdown</CardTitle>
        <CardDescription>
          Customer conversation intents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical" margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              type="number"
              className="text-xs"
              tick={{ fill: "var(--muted-foreground)" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              className="text-xs"
              tick={{ fill: "var(--muted-foreground)" }}
              width={120}
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
              dataKey="count"
              fill="var(--chart-4)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
