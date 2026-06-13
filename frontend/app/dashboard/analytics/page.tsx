"use client";

import { AnalyticsHeader } from "@/components/analytics/analytics-header";
import { KpiSummaryCards } from "@/components/analytics/kpi-summary-cards";
import { ConversationVolumeChart } from "@/components/analytics/conversation-volume-chart";
import { ChannelDistribution } from "@/components/analytics/channel-distribution";
import { VisitorGeographyChart } from "@/components/analytics/visitor-geography-chart";
import { IntentBreakdownChart } from "@/components/analytics/intent-breakdown-chart";
import { AiPerformanceRadar } from "@/components/analytics/ai-performance-radar";
import { SatisfactionTrendChart } from "@/components/analytics/satisfaction-trend-chart";
import { TopProductsTable } from "@/components/analytics/top-products-table";
import { ConversationHeatmap } from "@/components/analytics/conversation-heatmap";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <AnalyticsHeader />
      <KpiSummaryCards />

      <div className="grid gap-4 md:grid-cols-7">
        <ConversationVolumeChart />
        <ChannelDistribution />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <VisitorGeographyChart />
        <IntentBreakdownChart />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <AiPerformanceRadar />
        <SatisfactionTrendChart />
      </div>

      <TopProductsTable />
      <ConversationHeatmap />
    </div>
  );
}
