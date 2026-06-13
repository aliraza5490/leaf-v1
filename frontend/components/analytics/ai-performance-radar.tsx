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
import { useCssVariable } from "@/hooks/use-css-variable";

const data = [
  { subject: "Intent Accuracy", score: 92 },
  { subject: "Response Quality", score: 88 },
  { subject: "Resolution Rate", score: 94 },
  { subject: "Avg Confidence", score: 85 },
  { subject: "Multi-language", score: 78 },
];

export function AiPerformanceRadar() {
  const chart5 = useCssVariable("--chart-5");
  const mutedForeground = useCssVariable("--muted-foreground");
  const card = useCssVariable("--card");
  const border = useCssVariable("--border");
  const radius = useCssVariable("--radius");

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
            <PolarGrid stroke={border} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: mutedForeground, fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: mutedForeground, fontSize: 10 }}
            />
            <Radar
              name="Performance"
              dataKey="score"
              stroke={chart5}
              fill={chart5}
              fillOpacity={0.3}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: card,
                border: `1px solid ${border}`,
                borderRadius: radius,
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
