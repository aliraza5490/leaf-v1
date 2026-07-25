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
              dataKey="visitors"
              fill="var(--chart-3)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
