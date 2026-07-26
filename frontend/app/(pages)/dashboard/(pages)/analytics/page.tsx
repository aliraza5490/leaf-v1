import { AnalyticsHeader } from "@/app/(pages)/dashboard/(pages)/analytics/components/analytics-header";
import { KpiSummaryCards } from "@/app/(pages)/dashboard/(pages)/analytics/components/kpi-summary-cards";
import { ConversationVolumeChart } from "@/app/(pages)/dashboard/(pages)/analytics/components/conversation-volume-chart";
import { ChannelDistribution } from "@/app/(pages)/dashboard/(pages)/analytics/components/channel-distribution";
import { VisitorGeographyChart } from "@/app/(pages)/dashboard/(pages)/analytics/components/visitor-geography-chart";
import { IntentBreakdownChart } from "@/app/(pages)/dashboard/(pages)/analytics/components/intent-breakdown-chart";
import { AiPerformanceRadar } from "@/app/(pages)/dashboard/(pages)/analytics/components/ai-performance-radar";
import { SatisfactionTrendChart } from "@/app/(pages)/dashboard/(pages)/analytics/components/satisfaction-trend-chart";
import { TopProductsTable } from "@/app/(pages)/dashboard/(pages)/analytics/components/top-products-table";
import { ConversationHeatmap } from "@/app/(pages)/dashboard/(pages)/analytics/components/conversation-heatmap";

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
