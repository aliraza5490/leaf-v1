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
  { name: "United States", visitors: 1245 },
  { name: "United Kingdom", visitors: 832 },
  { name: "Canada", visitors: 621 },
  { name: "Germany", visitors: 498 },
  { name: "France", visitors: 387 },
  { name: "Australia", visitors: 312 },
  { name: "Netherlands", visitors: 245 },
  { name: "India", visitors: 198 },
];

export function VisitorGeographyChart() {
  const chart3 = useCssVariable("--chart-3");
  const mutedForeground = useCssVariable("--muted-foreground");
  const card = useCssVariable("--card");
  const border = useCssVariable("--border");
  const radius = useCssVariable("--radius");

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Visitor Geography</CardTitle>
        <CardDescription>
          Top visitor locations by country
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
              dataKey="visitors"
              fill={chart3}
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
