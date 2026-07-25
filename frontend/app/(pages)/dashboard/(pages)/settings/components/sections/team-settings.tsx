"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, MoreHorizontal } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SettingsTeamMember, MemberRole } from "@/app/(pages)/dashboard/(pages)/settings/types";

interface TeamSettingsProps {
  members: SettingsTeamMember[];
  onMembersChange: (members: SettingsTeamMember[]) => void;
}

export function TeamSettings({ members, onMembersChange }: TeamSettingsProps) {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<MemberRole>("viewer");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeVariant = (role: MemberRole) => {
    switch (role) {
      case "admin":
        return "default";
      case "editor":
        return "secondary";
      case "viewer":
        return "outline";
    }
  };

  const getStatusBadgeVariant = (status: SettingsTeamMember["status"]) => {
    switch (status) {
      case "active":
        return "default";
      case "invited":
        return "secondary";
      case "disabled":
        return "destructive";
    }
  };

  const removeMember = (id: string) => {
    onMembersChange(members.filter((m) => m.id !== id));
    toast.success("Team member removed");
  };

  const changeRole = (id: string, role: MemberRole) => {
    onMembersChange(
      members.map((m) => (m.id === id ? { ...m, role } : m))
    );
    toast.success("Role updated");
  };

  const sendInvite = () => {
    if (!inviteEmail.trim()) return;
    const newMember: SettingsTeamMember = {
      id: Date.now().toString(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      status: "invited",
    };
    onMembersChange([...members, newMember]);
    setInviteEmail("");
    setInviteRole("viewer");
    setShowInviteDialog(false);
    toast.success("Invitation sent");
  };

  return (
    <Tabs defaultValue="members" className="w-full">
      <TabsList variant="line">
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="roles">Roles</TabsTrigger>
        <TabsTrigger value="invitations">Invitations</TabsTrigger>
      </TabsList>

      <TabsContent value="members" className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage who has access to your dashboard</CardDescription>
              </div>
              <Button onClick={() => setShowInviteDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={getRoleBadgeVariant(member.role)}>
                    {member.role}
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(member.status)}>
                    {member.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => changeRole(member.id, "admin")}>
                        Make Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => changeRole(member.id, "editor")}>
                        Make Editor
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => changeRole(member.id, "viewer")}>
                        Make Viewer
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => removeMember(member.id)}
                        className="text-destructive"
                      >
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="roles" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
            <CardDescription>Define what each role can do</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Admin</h3>
                  <Badge>Full Access</Badge>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>- Full access to all settings and features</li>
                  <li>- Manage team members and roles</li>
                  <li>- Access to billing and subscription</li>
                  <li>- View all conversations and analytics</li>
                </ul>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Editor</h3>
                  <Badge variant="secondary">Limited Access</Badge>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>- Manage products and knowledge base</li>
                  <li>- View and respond to conversations</li>
                  <li>- Access analytics and reports</li>
                  <li>- Cannot manage team or billing</li>
                </ul>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Viewer</h3>
                  <Badge variant="outline">Read Only</Badge>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>- View conversations and analytics</li>
                  <li>- View products and knowledge base</li>
                  <li>- Cannot make changes or respond</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="invitations" className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pending Invitations</CardTitle>
                <CardDescription>Manage outstanding team invitations</CardDescription>
              </div>
              <Button onClick={() => setShowInviteDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Invitation
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {members
              .filter((m) => m.status === "invited")
              .map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-muted/30"
                >
                  <div>
                    <p className="font-medium">{member.email}</p>
                    <p className="text-sm text-muted-foreground">
                      Role: {member.role} - Invited pending
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Resend
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMember(member.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            {members.filter((m) => m.status === "invited").length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No pending invitations
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="inviteEmail">Email Address</Label>
              <Input
                id="inviteEmail"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={inviteRole}
                onValueChange={(v) => setInviteRole(v as MemberRole)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={sendInvite} disabled={!inviteEmail.trim()}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}
