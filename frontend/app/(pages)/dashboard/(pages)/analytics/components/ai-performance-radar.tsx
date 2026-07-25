"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { subject: "Intent Accuracy", score: 92 },
  { subject: "Response Quality", score: 88 },
  { subject: "Resolution Rate", score: 94 },
  { subject: "Avg Confidence", score: 85 },
  { subject: "Multi-language", score: 78 },
];

export function AiPerformanceRadar() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>AI Performance</CardTitle>
        <CardDescription>
          Key AI assistant performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data}>
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
            />
            <Radar
              name="Performance"
              dataKey="score"
              stroke="var(--chart-5)"
              fill="var(--chart-5)"
              fillOpacity={0.3}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "var(--radius)",
                color: "var(--card-foreground)",
              }}
              labelStyle={{ color: "var(--card-foreground)", fontWeight: 600 }}
              itemStyle={{ color: "var(--card-foreground)" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
