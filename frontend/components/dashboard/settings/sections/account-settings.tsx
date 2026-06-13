"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AccountSettings as AccountSettingsType } from "@/lib/settings/types";

interface AccountSettingsProps {
  settings: AccountSettingsType;
  onSettingsChange: (settings: AccountSettingsType) => void;
}

export function AccountSettings({ settings, onSettingsChange }: AccountSettingsProps) {
  const update = <K extends keyof AccountSettingsType>(
    key: K,
    value: AccountSettingsType[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList variant="line">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={settings.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={settings.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="mt-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
              </div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </div>
                <Switch
                  checked={settings.twoFactorEnabled}
                  onCheckedChange={(v) => update("twoFactorEnabled", v)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {settings.twoFactorEnabled ? (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Two-factor authentication is enabled
                  </p>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Enable two-factor authentication to secure your account with an additional
                  verification step.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Manage your active login sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div>
                  <p className="font-medium text-sm">Current Session</p>
                  <p className="text-xs text-muted-foreground">
                    Chrome on macOS - Active now
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  This device
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div>
                  <p className="font-medium text-sm">Mobile Session</p>
                  <p className="text-xs text-muted-foreground">
                    Safari on iPhone - 2 hours ago
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Revoke
                </Button>
              </div>
              <Button variant="destructive" size="sm">
                Revoke All Other Sessions
              </Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="preferences" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your dashboard experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select
                value={settings.theme}
                onValueChange={(v) =>
                  update("theme", v as AccountSettingsType["theme"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Session Timeout</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={5}
                  max={480}
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    update("sessionTimeout", parseInt(e.target.value) || 0)
                  }
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">minutes</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Auto-logout after period of inactivity
              </p>
            </div>
            <div className="space-y-2">
              <Label>Dashboard Layout</Label>
              <Select defaultValue="default">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="comfortable">Comfortable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
