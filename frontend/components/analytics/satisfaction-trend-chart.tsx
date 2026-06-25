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
import { useCssVariable } from "@/hooks/use-css-variable";

const data = [
  { name: "Week 1", csat: 4.3, responses: 120 },
  { name: "Week 2", csat: 4.5, responses: 145 },
  { name: "Week 3", csat: 4.4, responses: 162 },
  { name: "Week 4", csat: 4.7, responses: 138 },
  { name: "Week 5", csat: 4.6, responses: 189 },
  { name: "Week 6", csat: 4.8, responses: 156 },
];

export function SatisfactionTrendChart() {
  const chart2 = useCssVariable("--chart-2");
  const chart3 = useCssVariable("--chart-3");
  const mutedForeground = useCssVariable("--muted-foreground");
  const card = useCssVariable("--card");
  const border = useCssVariable("--border");
  const radius = useCssVariable("--radius");

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
            <CartesianGrid strokeDasharray="3 3" stroke={border} />
            <XAxis
              dataKey="name"
              className="text-xs"
              tick={{ fill: mutedForeground }}
            />
            <YAxis
              yAxisId="left"
              domain={[3.5, 5]}
              className="text-xs"
              tick={{ fill: mutedForeground }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
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
            <Bar
              yAxisId="right"
              dataKey="responses"
              fill={chart3}
              opacity={0.3}
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="csat"
              stroke={chart2}
              strokeWidth={2}
              dot={{ fill: chart2, r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
