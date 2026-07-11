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
import { useAnalyticsGeography } from "@/hooks/use-conversation-stats";

export function VisitorGeographyChart() {
  const chart3 = useCssVariable("--chart-3");
  const mutedForeground = useCssVariable("--muted-foreground");
  const card = useCssVariable("--card");
  const border = useCssVariable("--border");
  const radius = useCssVariable("--radius");

  const { geography, loading } = useAnalyticsGeography();

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Visitor Geography</CardTitle>
        <CardDescription>
          Top visitor locations by country
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Loading...
          </div>
        ) : geography.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={geography} layout="vertical" margin={{ left: -20 }}>

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
        )}
      </CardContent>
    </Card>
  );
}

