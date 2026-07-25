export type TeamMemberRole = "admin" | "manager" | "agent";

export type TeamMemberStatus = "active" | "invited" | "inactive";

export type TeamSortField = "name" | "role" | "joinedAt" | "lastActive";

export type TeamViewMode = "table" | "grid";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamMemberRole;
  status: TeamMemberStatus;
  avatar?: string;
  joinedAt: string;
  lastActive: string;
  conversationsHandled: number;
}

export interface TeamMemberFormData {
  name: string;
  email: string;
  role: TeamMemberRole;
}

export interface TeamFilters {
  search: string;
  role: TeamMemberRole | "all";
  status: TeamMemberStatus | "all";
  sortField: TeamSortField;
  sortDirection: "asc" | "desc";
}
