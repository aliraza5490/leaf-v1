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
import { useAnalyticsSatisfaction } from "@/hooks/use-conversation-stats";

export function SatisfactionTrendChart() {
  const chart2 = useCssVariable("--chart-2");
  const chart3 = useCssVariable("--chart-3");
  const mutedForeground = useCssVariable("--muted-foreground");
  const card = useCssVariable("--card");
  const border = useCssVariable("--border");
  const radius = useCssVariable("--radius");

  const { satisfaction, loading } = useAnalyticsSatisfaction();

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Customer Satisfaction</CardTitle>
        <CardDescription>
          CSAT score trend with response volume
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Loading...
          </div>
        ) : satisfaction.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={satisfaction} margin={{ left: -20 }}>

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
        )}
      </CardContent>
    </Card>
  );
}

