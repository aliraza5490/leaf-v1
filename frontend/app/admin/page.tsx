"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Store, Settings, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminStatsCards } from "@/components/admin/stats-cards";
import { getAdminTopStores } from "@/lib/admin/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Store as StoreType } from "@/lib/admin/types";

export default function AdminOverviewPage() {
  const [topStores, setTopStores] = useState<StoreType[]>([]);
  const [loadingStores, setLoadingStores] = useState(true);

  useEffect(() => {
    getAdminTopStores(5)
      .then((res) => setTopStores(res.items))
      .catch(() => {})
      .finally(() => setLoadingStores(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
          <p className="text-muted-foreground">
            Platform-wide metrics and quick actions.
          </p>
        </div>
      </div>

      <AdminStatsCards />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Stores
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/stores">
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStores ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : topStores.length === 0 ? (
              <p className="text-sm text-muted-foreground">No stores yet.</p>
            ) : (
              <div className="space-y-3">
                {topStores.map((store) => (
                  <div
                    key={store.id}
                    className="flex items-center justify-between rounded-lg border border-border/40 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <Store className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{store.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {store.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          store.status === "active"
                            ? "default"
                            : store.status === "suspended"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {store.status}
                      </Badge>
                      <Badge variant="outline">{store.plan}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button variant="outline" asChild className="justify-start">
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <Link href="/admin/stores">
                <Store className="mr-2 h-4 w-4" />
                Manage Stores
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <Link href="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                System Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
