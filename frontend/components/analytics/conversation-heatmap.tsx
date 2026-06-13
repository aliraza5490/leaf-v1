"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 24 }, (_, i) => i);

const heatmapData = [
  [2, 1, 1, 0, 0, 1, 3, 8, 15, 22, 28, 25, 30, 27, 24, 20, 18, 15, 12, 10, 8, 6, 4, 3],
  [3, 2, 1, 1, 0, 1, 4, 9, 16, 24, 30, 28, 32, 29, 26, 22, 20, 16, 14, 11, 9, 7, 5, 4],
  [2, 1, 1, 0, 1, 2, 5, 10, 18, 26, 32, 30, 35, 31, 28, 24, 22, 18, 15, 12, 10, 8, 5, 3],
  [3, 2, 1, 1, 0, 1, 4, 9, 17, 25, 31, 29, 33, 30, 27, 23, 21, 17, 14, 11, 9, 7, 5, 4],
  [4, 3, 2, 1, 1, 2, 5, 11, 19, 28, 35, 33, 38, 34, 30, 26, 24, 20, 16, 13, 11, 8, 6, 5],
  [5, 4, 3, 2, 1, 1, 2, 4, 8, 12, 15, 18, 20, 18, 16, 14, 12, 10, 8, 7, 6, 5, 5, 5],
  [4, 3, 2, 1, 1, 1, 2, 3, 6, 10, 12, 14, 16, 14, 12, 10, 9, 8, 7, 6, 5, 4, 4, 4],
];

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversation Heatmap</CardTitle>
        <CardDescription>
          Conversation volume by day of week and hour
        </CardDescription>
      </CardHeader>
      <CardContent>
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
