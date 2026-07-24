"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAdminOverview, getAdminTrends, getAdminTopStores } from "@/lib/admin/api";
import type { PlatformOverview, TrendsResponse, Store } from "@/lib/admin/types";

export default function AdminAnalyticsPage() {
  const [overview, setOverview] = useState<PlatformOverview | null>(null);
  const [trends, setTrends] = useState<TrendsResponse | null>(null);
  const [topStores, setTopStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAdminOverview(),
      getAdminTrends(14),
      getAdminTopStores(10),
    ])
      .then(([ov, tr, ts]) => {
        setOverview(ov);
        setTrends(tr);
        setTopStores(ts.items);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const chartData = trends?.daily.map((d) => ({
    name: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    stores: d.stores,
    conversations: d.conversations,
  })) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Platform-wide analytics and trends.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        overview && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overview.total_conversations.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {overview.total_messages.toLocaleString()} messages
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overview.total_products.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  across {overview.total_stores} stores
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Platform Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overview.total_users.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {overview.active_stores} active stores
                </p>
              </CardContent>
            </Card>
          </div>
        )
      )}

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Conversation Volume</CardTitle>
            <CardDescription>
              Daily conversations across the platform (last 14 days)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData} margin={{ left: -20 }}>
                  <defs>
                    <linearGradient id="adminConv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="name"
                    className="text-xs"
                    tick={{ fill: "var(--muted-foreground)" }}
                  />
                  <YAxis className="text-xs" tick={{ fill: "var(--muted-foreground)" }} />
                  <Tooltip
                    cursor={{ stroke: "var(--border)", strokeDasharray: "3 3" }}
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "var(--radius)",
                      color: "var(--card-foreground)",
                    }}
                    labelStyle={{ color: "var(--card-foreground)", fontWeight: 600 }}
                    itemStyle={{ color: "var(--card-foreground)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="conversations"
                    stroke="var(--chart-1)"
                    fillOpacity={1}
                    fill="url(#adminConv)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Store Growth</CardTitle>
            <CardDescription>New stores per day</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="name"
                    className="text-xs"
                    tick={{ fill: "var(--muted-foreground)" }}
                  />
                  <YAxis className="text-xs" tick={{ fill: "var(--muted-foreground)" }} />
                  <Tooltip
                    cursor={{ fill: "var(--muted)", opacity: 0.2 }}
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "var(--radius)",
                      color: "var(--card-foreground)",
                    }}
                    labelStyle={{ color: "var(--card-foreground)", fontWeight: 600 }}
                    itemStyle={{ color: "var(--card-foreground)" }}
                  />
                  <Bar dataKey="stores" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Stores</CardTitle>
          <CardDescription>Stores ranked by recent activity</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Plan</TableHead>
                  <TableHead className="text-right">Conversations</TableHead>
                  <TableHead className="text-right">Products</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topStores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No stores found.
                    </TableCell>
                  </TableRow>
                ) : (
                  topStores.map((store) => (
                    <TableRow key={store.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{store.name}</span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {store.id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
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
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{store.plan}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {(store.conversation_count ?? 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {(store.product_count ?? 0).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
