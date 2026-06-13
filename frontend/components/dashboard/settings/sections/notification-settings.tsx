"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { NotificationSettings as NotificationSettingsType } from "@/lib/settings/types";

interface NotificationSettingsProps {
  settings: NotificationSettingsType;
  onSettingsChange: (settings: NotificationSettingsType) => void;
}

export function NotificationSettings({ settings, onSettingsChange }: NotificationSettingsProps) {
  const update = <K extends keyof NotificationSettingsType>(
    key: K,
    value: NotificationSettingsType[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <Tabs defaultValue="email" className="w-full">
      <TabsList variant="line">
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="in-app">In-App</TabsTrigger>
        <TabsTrigger value="escalation">Escalation</TabsTrigger>
      </TabsList>

      <TabsContent value="email" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>Configure which events trigger email notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Conversations</Label>
                <p className="text-xs text-muted-foreground">
                  Receive an email when a new conversation starts
                </p>
              </div>
              <Switch
                checked={settings.emailNewConversation}
                onCheckedChange={(v) => update("emailNewConversation", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Daily Report</Label>
                <p className="text-xs text-muted-foreground">
                  Receive a daily summary of conversations and metrics
                </p>
              </div>
              <Switch
                checked={settings.emailDailyReport}
                onCheckedChange={(v) => update("emailDailyReport", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Report</Label>
                <p className="text-xs text-muted-foreground">
                  Receive a weekly summary every Monday
                </p>
              </div>
              <Switch
                checked={settings.emailWeeklyReport}
                onCheckedChange={(v) => update("emailWeeklyReport", v)}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="in-app" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>In-App Notifications</CardTitle>
            <CardDescription>Configure browser and dashboard notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Visitor Alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Show notifications when visitors engage with the assistant
                </p>
              </div>
              <Switch
                checked={settings.inAppVisitorAlerts}
                onCheckedChange={(v) => update("inAppVisitorAlerts", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Team Mentions</Label>
                <p className="text-xs text-muted-foreground">
                  Notify when team members mention you in conversations
                </p>
              </div>
              <Switch
                checked={settings.inAppTeamMentions}
                onCheckedChange={(v) => update("inAppTeamMentions", v)}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="escalation" className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Escalation Settings</CardTitle>
                <CardDescription>Configure automatic escalation to human agents</CardDescription>
              </div>
              <Switch
                checked={settings.escalationEnabled}
                onCheckedChange={(v) => update("escalationEnabled", v)}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Escalation Timeout</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={settings.escalationTimeout}
                  onChange={(e) => update("escalationTimeout", parseInt(e.target.value) || 0)}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">minutes</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Time before a conversation is escalated if no response
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="escalationEmail">Escalation Email</Label>
              <Input
                id="escalationEmail"
                type="email"
                value={settings.escalationEmail}
                onChange={(e) => update("escalationEmail", e.target.value)}
                placeholder="escalations@your-store.com"
              />
              <p className="text-xs text-muted-foreground">
                Email address to receive escalation notifications
              </p>
            </div>
            <div className="space-y-2">
              <Label>Escalation Trigger</Label>
              <Select defaultValue="timeout">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="timeout">After Timeout</SelectItem>
                  <SelectItem value="keyword">Keyword Detection</SelectItem>
                  <SelectItem value="manual">Manual Only</SelectItem>
                  <SelectItem value="all">All Triggers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
