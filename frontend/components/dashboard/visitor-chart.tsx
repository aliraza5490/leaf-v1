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
  { name: "00:00", visitors: 12 },
  { name: "04:00", visitors: 8 },
  { name: "08:00", visitors: 45 },
  { name: "12:00", visitors: 89 },
  { name: "16:00", visitors: 120 },
  { name: "20:00", visitors: 78 },
  { name: "Now", visitors: 95 },
];

export function VisitorChart() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Visitor Activity</CardTitle>
        <CardDescription>
          Active visitors throughout the day
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ left: -20 }}>
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
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
