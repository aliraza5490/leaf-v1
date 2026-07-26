"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Search, Users } from "lucide-react";

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
import { AdminUserTable } from "@/app/(pages)/admin/(pages)/users/components/user-table";
import { AdminUserDialog } from "@/app/(pages)/admin/(pages)/users/components/user-dialog";
import {
  getAdminUsersAction,
  getAdminUserStatsAction,
  updateAdminUserAction,
  deactivateAdminUserAction,
} from "@/app/actions/admin";
import type { AdminUser, AdminUserUpdate, UserStats } from "@/app/(pages)/admin/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminUsersAction({
        q: search || undefined,
        role: roleFilter === "all" ? undefined : roleFilter,
        page,
        page_size: 20,
      });
      if (res.success && res.data) {
        setUsers(res.data.items);
        setTotal(res.data.total);
      } else {
        toast.error(res.error || "Failed to load users");
      }
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    getAdminUserStatsAction().then((res) => {
      if (res.success && res.data) setStats(res.data);
    }).catch(() => {});
  }, []);

  function handleEdit(user: AdminUser) {
    setEditingUser(user);
    setDialogOpen(true);
  }

  async function handleSave(data: AdminUserUpdate) {
    if (!editingUser) return;
    try {
      const res = await updateAdminUserAction(editingUser.email, data);
      if (res.success) {
        toast.success(`User ${editingUser.email} updated`);
        fetchUsers();
      } else {
        toast.error(res.error || "Failed to update user");
      }
    } catch {
      toast.error("Failed to update user");
    }
  }

  async function handleDeactivate(user: AdminUser) {
    if (!confirm(`Deactivate ${user.email}?`)) return;
    try {
      const res = await deactivateAdminUserAction(user.email);
      if (res.success) {
        toast.success(`User ${user.email} deactivated`);
        fetchUsers();
      } else {
        toast.error(res.error || "Failed to deactivate user");
      }
    } catch {
      toast.error("Failed to deactivate user");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Manage all platform users and their roles.
        </p>
      </div>

      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
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
              <div className="text-2xl font-bold">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.by_role.superadmin}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.by_role.admin}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by email or name..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          value={roleFilter}
          onValueChange={(v) => {
            setRoleFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="superadmin">Super Admin</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">User</SelectItem>
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
        <AdminUserTable
          users={users}
          onEdit={handleEdit}
          onDeactivate={handleDeactivate}
        />
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

      <AdminUserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={editingUser}
        onSave={handleSave}
      />
    </div>
  );
}
