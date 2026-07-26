"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Store,
  MessageSquare,
  Package,
  Mail,
  Activity,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminOverviewAction } from "@/app/actions/admin";
import type { PlatformOverview } from "@/app/(pages)/admin/types";

interface AdminStatsCardsProps {
  overview?: PlatformOverview | null;
}

export function AdminStatsCards({ overview: initialOverview }: AdminStatsCardsProps = {}) {
  const [data, setData] = useState<PlatformOverview | null>(initialOverview ?? null);
  const [loading, setLoading] = useState(!initialOverview);

  useEffect(() => {
    if (!initialOverview) {
      getAdminOverviewAction()
        .then((res) => {
          if (res.success && res.data) setData(res.data);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [initialOverview]);

  const stats = [
    {
      title: "Total Users",
      value: data?.total_users ?? 0,
      icon: Users,
    },
    {
      title: "Total Stores",
      value: data?.total_stores ?? 0,
      icon: Store,
    },
    {
      title: "Active Stores",
      value: data?.active_stores ?? 0,
      icon: Activity,
    },
    {
      title: "Products",
      value: data?.total_products ?? 0,
      icon: Package,
    },
    {
      title: "Conversations",
      value: data?.total_conversations ?? 0,
      icon: MessageSquare,
    },
    {
      title: "Messages",
      value: data?.total_messages ?? 0,
      icon: Mail,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {stat.value.toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
