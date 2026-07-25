"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  getAdminSettings,
  createAdminSetting,
  updateAdminSetting,
  deleteAdminSetting,
} from "@/lib/api/admin";
import type { SystemSetting } from "@/app/(pages)/admin/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<SystemSetting | null>(null);

  const [formKey, setFormKey] = useState("");
  const [formValue, setFormValue] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminSettings();
      setSettings(data);
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  function openCreate() {
    setFormKey("");
    setFormValue("");
    setFormDescription("");
    setCreateOpen(true);
  }

  function openEdit(setting: SystemSetting) {
    setEditingSetting(setting);
    setFormValue(setting.value);
    setFormDescription(setting.description);
    setEditOpen(true);
  }

  async function handleCreate() {
    if (!formKey.trim()) {
      toast.error("Key is required");
      return;
    }
    try {
      await createAdminSetting({
        key: formKey.trim(),
        value: formValue,
        description: formDescription,
      });
      toast.success("Setting created");
      setCreateOpen(false);
      fetchSettings();
    } catch {
      toast.error("Failed to create setting");
    }
  }

  async function handleUpdate() {
    if (!editingSetting) return;
    try {
      await updateAdminSetting(editingSetting.key, {
        value: formValue,
        description: formDescription,
      });
      toast.success("Setting updated");
      setEditOpen(false);
      fetchSettings();
    } catch {
      toast.error("Failed to update setting");
    }
  }

  async function handleDelete(key: string) {
    if (!confirm(`Delete setting "${key}"?`)) return;
    try {
      await deleteAdminSetting(key);
      toast.success("Setting deleted");
      fetchSettings();
    } catch {
      toast.error("Failed to delete setting");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">
            Platform-wide configuration and feature flags.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Setting
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : settings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No settings configured yet.</p>
            <Button variant="outline" className="mt-4" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Setting
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {settings.map((setting) => (
            <Card key={setting.key}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-semibold bg-muted px-2 py-0.5 rounded">
                      {setting.key}
                    </code>
                  </div>
                  {setting.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {setting.description}
                    </p>
                  )}
                  <p className="text-sm mt-1 font-mono text-foreground/80 truncate">
                    {setting.value || "(empty)"}
                  </p>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEdit(setting)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(setting.key)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Setting</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Key</Label>
              <Input
                placeholder="e.g. feature.dark_mode"
                value={formKey}
                onChange={(e) => setFormKey(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              <Textarea
                placeholder="Setting value"
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="What this setting controls"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleCreate}>
              <Save className="mr-2 h-4 w-4" />
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Setting</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Key</Label>
              <code className="text-sm bg-muted px-2 py-1 rounded block">
                {editingSetting?.key}
              </code>
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              <Textarea
                placeholder="Setting value"
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="What this setting controls"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleUpdate}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
