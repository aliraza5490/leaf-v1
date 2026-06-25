"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAnalyticsHeatmap } from "@/hooks/use-conversation-stats";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 24 }, (_, i) => i);

function getHeatmapColor(value: number) {
  if (value === 0) return "bg-muted/30";
  if (value <= 2) return "bg-chart-1/10";
  if (value <= 5) return "bg-chart-1/20";
  if (value <= 10) return "bg-chart-1/35";
  if (value <= 20) return "bg-chart-1/55";
  if (value <= 30) return "bg-chart-1/75";
  return "bg-chart-1";
}

export function ConversationHeatmap() {
  const { heatmap, loading } = useAnalyticsHeatmap();

  const heatmapData = days.map((day) =>
    hours.map((hour) => heatmap?.[day]?.[String(hour)] ?? 0)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversation Heatmap</CardTitle>
        <CardDescription>
          Conversation volume by day of week and hour
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            Loading...
          </div>
        ) : (
          <div className="space-y-1">
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <div />
              <div className="grid grid-cols-24 gap-0.5">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="text-center text-[10px] text-muted-foreground"
                  >
                    {hour % 3 === 0 ? `${hour.toString().padStart(2, "0")}` : ""}
                  </div>
                ))}
              </div>
            </div>
            {days.map((day, dayIndex) => (
              <div
                key={day}
                className="grid grid-cols-[100px_1fr] gap-2 items-center"
              >
                <div className="text-xs text-muted-foreground font-medium">
                  {day}
                </div>
                <div className="grid grid-cols-24 gap-0.5">
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className={`aspect-square rounded-sm ${getHeatmapColor(heatmapData[dayIndex][hour])} transition-colors hover:ring-1 hover:ring-ring`}
                      title={`${day} ${hour.toString().padStart(2, "0")}:00 - ${heatmapData[dayIndex][hour]} conversations`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex items-center justify-end gap-2">
          <span className="text-xs text-muted-foreground">Less</span>
          <div className="flex gap-0.5">
            <div className="h-3 w-3 rounded-sm bg-muted/30" />
            <div className="h-3 w-3 rounded-sm bg-chart-1/10" />
            <div className="h-3 w-3 rounded-sm bg-chart-1/20" />
            <div className="h-3 w-3 rounded-sm bg-chart-1/35" />
            <div className="h-3 w-3 rounded-sm bg-chart-1/55" />
            <div className="h-3 w-3 rounded-sm bg-chart-1/75" />
            <div className="h-3 w-3 rounded-sm bg-chart-1" />
          </div>
          <span className="text-xs text-muted-foreground">More</span>
        </div>
      </CardContent>
    </Card>
  );
}
