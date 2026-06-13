"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCssVariable } from "@/hooks/use-css-variable";

const data = [
  { name: "Text Chat", value: 68 },
  { name: "Voice Call", value: 24 },
  { name: "Email", value: 8 },
];

export function ChannelDistribution() {
  const chart1 = useCssVariable("--chart-1");
  const chart2 = useCssVariable("--chart-2");
  const chart3 = useCssVariable("--chart-3");
  const card = useCssVariable("--card");
  const border = useCssVariable("--border");
  const radius = useCssVariable("--radius");

  const COLORS = [chart1, chart2, chart3];

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Channel Distribution</CardTitle>
        <CardDescription>
          Interaction breakdown by channel type
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: card,
                border: `1px solid ${border}`,
                borderRadius: radius,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 flex justify-center gap-6">
          {data.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-xs text-muted-foreground">
                {entry.name} ({entry.value}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
