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
import { useAnalyticsVisitorActivity } from "@/hooks/use-conversation-stats";

export function VisitorChart() {
  const chart3 = useCssVariable("--chart-3");
  const mutedForeground = useCssVariable("--muted-foreground");
  const card = useCssVariable("--card");
  const border = useCssVariable("--border");
  const radius = useCssVariable("--radius");

  const { activity, loading } = useAnalyticsVisitorActivity();

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Visitor Activity</CardTitle>
        <CardDescription>
          Active visitors throughout the day
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Loading...
          </div>
        ) : activity.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activity} margin={{ left: -20 }}>

            <CartesianGrid strokeDasharray="3 3" stroke={border} />
            <XAxis
              dataKey="name"
              className="text-xs"
              tick={{ fill: mutedForeground }}
            />
            <YAxis
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
              dataKey="visitors"
              fill={chart3}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

