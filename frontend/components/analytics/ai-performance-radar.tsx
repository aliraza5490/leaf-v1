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
import { useAnalyticsAiPerformance } from "@/hooks/use-conversation-stats";

export function AiPerformanceRadar() {
  const chart5 = useCssVariable("--chart-5");
  const mutedForeground = useCssVariable("--muted-foreground");
  const card = useCssVariable("--card");
  const border = useCssVariable("--border");
  const radius = useCssVariable("--radius");

  const { performance, loading } = useAnalyticsAiPerformance();

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>AI Performance</CardTitle>
        <CardDescription>
          Key AI assistant performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Loading...
          </div>
        ) : performance.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={performance}>

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
        )}
      </CardContent>
    </Card>
  );
}

