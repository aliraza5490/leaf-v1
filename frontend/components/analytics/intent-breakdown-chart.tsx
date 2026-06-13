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
import { useCssVariable } from "@/hooks/use-css-variable";

const data = [
  { name: "Product Inquiry", count: 1245 },
  { name: "Order Support", count: 832 },
  { name: "Returns & Refunds", count: 421 },
  { name: "General FAQ", count: 687 },
  { name: "Recommendations", count: 534 },
];

export function IntentBreakdownChart() {
  const chart4 = useCssVariable("--chart-4");
  const mutedForeground = useCssVariable("--muted-foreground");
  const card = useCssVariable("--card");
  const border = useCssVariable("--border");
  const radius = useCssVariable("--radius");

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
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={border} />
            <XAxis
              type="number"
              className="text-xs"
              tick={{ fill: mutedForeground }}
            />
            <YAxis
              type="category"
              dataKey="name"
              className="text-xs"
              tick={{ fill: mutedForeground }}
              width={120}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: card,
                border: `1px solid ${border}`,
                borderRadius: radius,
              }}
            />
            <Bar
              dataKey="count"
              fill={chart4}
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
