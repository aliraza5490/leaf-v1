"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type {
  ConversationFlowsConfig as ConversationFlowsConfigType,
  ConversationRule,
  EscalationTrigger,
} from "@/lib/bot-config/types";

interface ConversationFlowsConfigProps {
  config: ConversationFlowsConfigType;
  onConfigChange: (config: ConversationFlowsConfigType) => void;
}

export function ConversationFlowsConfig({ config, onConfigChange }: ConversationFlowsConfigProps) {
  const update = <K extends keyof ConversationFlowsConfigType>(
    key: K,
    value: ConversationFlowsConfigType[K]
  ) => {
    onConfigChange({ ...config, [key]: value });
  };

  const addRule = () => {
    const newRule: ConversationRule = {
      id: Date.now().toString(),
      name: "New Rule",
      trigger: "",
      response: "",
      enabled: true,
    };
    update("rules", [...config.rules, newRule]);
  };

  const updateRule = (id: string, updates: Partial<ConversationRule>) => {
    update(
      "rules",
      config.rules.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const removeRule = (id: string) => {
    update(
      "rules",
      config.rules.filter((r) => r.id !== id)
    );
  };

  const addEscalationTrigger = () => {
    const newTrigger: EscalationTrigger = {
      id: Date.now().toString(),
      keyword: "",
      action: "human-handoff",
      enabled: true,
    };
    update("escalationTriggers", [...config.escalationTriggers, newTrigger]);
  };

  const updateEscalationTrigger = (id: string, updates: Partial<EscalationTrigger>) => {
    update(
      "escalationTriggers",
      config.escalationTriggers.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const removeEscalationTrigger = (id: string) => {
    update(
      "escalationTriggers",
      config.escalationTriggers.filter((t) => t.id !== id)
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Conversation Settings</CardTitle>
          <CardDescription>Configure general conversation behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="welcomeMessage">Welcome Message</Label>
            <Textarea
              id="welcomeMessage"
              value={config.welcomeMessage}
              onChange={(e) => update("welcomeMessage", e.target.value)}
              placeholder="Enter welcome message..."
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              Message shown when a user starts a new conversation
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fallbackMessage">Fallback Message</Label>
            <Textarea
              id="fallbackMessage"
              value={config.fallbackMessage}
              onChange={(e) => update("fallbackMessage", e.target.value)}
              placeholder="Enter fallback message..."
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              Message shown when the bot cannot understand the user
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="maxConversationTurns">Max Conversation Turns</Label>
              <Input
                id="maxConversationTurns"
                type="number"
                min="1"
                max="100"
                value={config.maxConversationTurns}
                onChange={(e) => update("maxConversationTurns", parseInt(e.target.value) || 20)}
              />
              <p className="text-xs text-muted-foreground">
                Maximum back-and-forth exchanges before suggesting escalation
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="autoCloseMinutes">Auto-Close (minutes)</Label>
              <Input
                id="autoCloseMinutes"
                type="number"
                min="5"
                max="120"
                value={config.autoCloseMinutes}
                onChange={(e) => update("autoCloseMinutes", parseInt(e.target.value) || 30)}
              />
              <p className="text-xs text-muted-foreground">
                Automatically close inactive conversations after this time
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Auto-Response Rules</CardTitle>
              <CardDescription>
                Define rules for automatic responses to specific triggers
              </CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={addRule}>
              <Plus className="mr-2 h-4 w-4" />
              Add Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.rules.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No rules configured. Add a rule to create auto-responses.
            </p>
          ) : (
            config.rules.map((rule) => (
              <div
                key={rule.id}
                className="rounded-lg border p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Input
                    value={rule.name}
                    onChange={(e) => updateRule(rule.id, { name: e.target.value })}
                    className="max-w-xs font-medium"
                    placeholder="Rule name"
                  />
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={(v) => updateRule(rule.id, { enabled: v })}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeRule(rule.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Trigger Pattern (regex)</Label>
                  <Input
                    value={rule.trigger}
                    onChange={(e) => updateRule(rule.id, { trigger: e.target.value })}
                    placeholder="e.g., shipping|delivery"
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Response</Label>
                  <Textarea
                    value={rule.response}
                    onChange={(e) => updateRule(rule.id, { response: e.target.value })}
                    placeholder="Auto-response message..."
                    rows={2}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Escalation Triggers</CardTitle>
              <CardDescription>
                Define keywords that trigger human handoff or notifications
              </CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={addEscalationTrigger}>
              <Plus className="mr-2 h-4 w-4" />
              Add Trigger
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.escalationTriggers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No escalation triggers configured.
            </p>
          ) : (
            config.escalationTriggers.map((trigger) => (
              <div
                key={trigger.id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <Input
                  value={trigger.keyword}
                  onChange={(e) =>
                    updateEscalationTrigger(trigger.id, { keyword: e.target.value })
                  }
                  placeholder="Keywords (e.g., human|agent)"
                  className="flex-1 font-mono text-sm"
                />
                <Select
                  value={trigger.action}
                  onValueChange={(v) =>
                    updateEscalationTrigger(trigger.id, {
                      action: v as EscalationTrigger["action"],
                    })
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="human-handoff">Human Handoff</SelectItem>
                    <SelectItem value="email-notification">Email Notification</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
                <Switch
                  checked={trigger.enabled}
                  onCheckedChange={(v) =>
                    updateEscalationTrigger(trigger.id, { enabled: v })
                  }
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeEscalationTrigger(trigger.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
