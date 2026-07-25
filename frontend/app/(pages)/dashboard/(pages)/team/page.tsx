"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { TeamHeader } from "@/app/(pages)/dashboard/(pages)/team/components/team-header";
import { TeamToolbar } from "@/app/(pages)/dashboard/(pages)/team/components/team-toolbar";
import { TeamTable } from "@/app/(pages)/dashboard/(pages)/team/components/team-table";
import { TeamGrid } from "@/app/(pages)/dashboard/(pages)/team/components/team-grid";
import { TeamMemberDialog } from "@/app/(pages)/dashboard/(pages)/team/components/team-member-dialog";
import type {
  TeamMember,
  TeamMemberFormData,
  TeamFilters,
  TeamViewMode,
} from "@/app/(pages)/dashboard/(pages)/team/types";
import { mockTeamMembers } from "@/mocks/agents";

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [viewMode, setViewMode] = useState<TeamViewMode>("table");
  const [filters, setFilters] = useState<TeamFilters>({
    search: "",
    role: "all",
    status: "all",
    sortField: "name",
    sortDirection: "asc",
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const filteredMembers = useMemo(() => {
    let result = [...members];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(search) ||
          m.email.toLowerCase().includes(search)
      );
    }

    if (filters.role !== "all") {
      result = result.filter((m) => m.role === filters.role);
    }

    if (filters.status !== "all") {
      result = result.filter((m) => m.status === filters.status);
    }

    result.sort((a, b) => {
      const direction = filters.sortDirection === "asc" ? 1 : -1;
      switch (filters.sortField) {
        case "name":
          return a.name.localeCompare(b.name) * direction;
        case "role":
          return a.role.localeCompare(b.role) * direction;
        case "joinedAt":
          return (new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()) * direction;
        case "lastActive":
          return (new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime()) * direction;
        default:
          return 0;
      }
    });

    return result;
  }, [members, filters]);

  const handleInvite = () => {
    setEditingMember(null);
    setDialogOpen(true);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setDialogOpen(true);
  };

  const handleRemove = (member: TeamMember) => {
    setMembers((prev) => prev.filter((m) => m.id !== member.id));
    toast.success(`${member.name} has been removed from the team.`);
  };

  const handleSave = (data: TeamMemberFormData) => {
    if (editingMember) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === editingMember.id
            ? {
                ...m,
                ...data,
              }
            : m
        )
      );
      toast.success(`${data.name}'s information has been updated.`);
    } else {
      const newMember: TeamMember = {
        id: `t${Date.now()}`,
        ...data,
        status: "invited",
        joinedAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        conversationsHandled: 0,
      };
      setMembers((prev) => [newMember, ...prev]);
      toast.success(`Invitation sent to ${data.name}.`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <TeamHeader onInvite={handleInvite} />

      <TeamToolbar
        filters={filters}
        onFiltersChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {viewMode === "table" ? (
        <TeamTable
          members={filteredMembers}
          onEdit={handleEdit}
          onRemove={handleRemove}
        />
      ) : (
        <TeamGrid
          members={filteredMembers}
          onEdit={handleEdit}
          onRemove={handleRemove}
        />
      )}

      <TeamMemberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        member={editingMember}
        onSave={handleSave}
      />
    </div>
  );
}
