"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalyticsChannels } from "@/app/(pages)/dashboard/(pages)/conversations/hooks";

export function ChannelDistribution() {
  const { channels, loading } = useAnalyticsChannels();

  const totalCount = channels?.channels.reduce((sum, c) => sum + c.count, 0) ?? 0;

  const data = (channels?.channels ?? []).map((c) => ({
    name: c.channel === "chat" ? "Text Chat" : c.channel === "voice" ? "Voice Call" : c.channel,
    value: totalCount > 0 ? Math.round((c.count / totalCount) * 100) : 0,
    count: c.count,
  }));

  const COLORS = ["var(--chart-1)", "var(--chart-2)"];

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Channel Distribution</CardTitle>
        <CardDescription>
          Interaction breakdown by channel type
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Loading...
          </div>
        ) : data.length === 0 || totalCount === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No data yet
          </div>
        ) : (
          <>
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
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius)",
                    color: "var(--card-foreground)",
                  }}
                  labelStyle={{ color: "var(--card-foreground)", fontWeight: 600 }}
                  itemStyle={{ color: "var(--card-foreground)" }}
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
          </>
        )}
      </CardContent>
    </Card>
  );
}
