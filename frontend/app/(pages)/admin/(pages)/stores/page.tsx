"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Search, Store } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminStoreTable } from "@/app/(pages)/admin/(pages)/stores/components/store-table";
import { AdminStoreDialog } from "@/app/(pages)/admin/(pages)/stores/components/store-dialog";
import {
  getAdminStores,
  getAdminStoreStats,
  updateAdminStore,
} from "@/lib/api/admin";
import type { Store as StoreType, StoreUpdate, StoreStats } from "@/app/(pages)/admin/types";

export default function AdminStoresPage() {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [stats, setStats] = useState<StoreStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreType | null>(null);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminStores({
        q: search || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
        plan: planFilter === "all" ? undefined : planFilter,
        page,
        page_size: 20,
      });
      setStores(res.items);
      setTotal(res.total);
    } catch {
      toast.error("Failed to load stores");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, planFilter, page]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    getAdminStoreStats().then(setStats).catch(() => {});
  }, []);

  function handleEdit(store: StoreType) {
    setEditingStore(store);
    setDialogOpen(true);
  }

  async function handleSave(data: StoreUpdate) {
    if (!editingStore) return;
    try {
      await updateAdminStore(editingStore.id, data);
      toast.success(`Store ${editingStore.name} updated`);
      fetchStores();
    } catch {
      toast.error("Failed to update store");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Stores</h1>
        <p className="text-muted-foreground">
          Manage all stores on the platform.
        </p>
      </div>

      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.by_status.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Trial</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.by_status.trial}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.by_status.suspended}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or ID..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={planFilter}
          onValueChange={(v) => {
            setPlanFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="All plans" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All plans</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="starter">Starter</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <AdminStoreTable stores={stores} onEdit={handleEdit} />
      )}

      {total > 20 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page * 20 >= total}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <AdminStoreDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        store={editingStore}
        onSave={handleSave}
      />
    </div>
  );
}
