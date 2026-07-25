"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { IntegrationSettings as IntegrationSettingsType, ApiKey } from "@/app/(pages)/dashboard/(pages)/settings/types";

interface IntegrationSettingsProps {
  settings: IntegrationSettingsType;
  onSettingsChange: (settings: IntegrationSettingsType) => void;
}

export function IntegrationSettings({ settings, onSettingsChange }: IntegrationSettingsProps) {
  const [showCreateKeyDialog, setShowCreateKeyDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const deleteApiKey = (id: string) => {
    onSettingsChange({
      ...settings,
      apiKeys: settings.apiKeys.filter((k) => k.id !== id),
    });
    toast.success("API key deleted");
  };

  const createApiKey = () => {
    if (!newKeyName.trim()) return;
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString(),
    };
    onSettingsChange({
      ...settings,
      apiKeys: [...settings.apiKeys, newKey],
    });
    setNewKeyName("");
    setShowCreateKeyDialog(false);
    toast.success("API key created");
  };

  const toggleWebhookActive = (id: string) => {
    onSettingsChange({
      ...settings,
      webhooks: settings.webhooks.map((w) =>
        w.id === id ? { ...w, active: !w.active } : w
      ),
    });
  };

  const deleteWebhook = (id: string) => {
    onSettingsChange({
      ...settings,
      webhooks: settings.webhooks.filter((w) => w.id !== id),
    });
    toast.success("Webhook deleted");
  };

  return (
    <Tabs defaultValue="api-keys" className="w-full">
      <TabsList variant="line">
        <TabsTrigger value="api-keys">API Keys</TabsTrigger>
        <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        <TabsTrigger value="embed-code">Embed Code</TabsTrigger>
      </TabsList>

      <TabsContent value="api-keys" className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage your API keys for external integrations</CardDescription>
              </div>
              <Button onClick={() => setShowCreateKeyDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Key
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-muted/30"
              >
                <div className="space-y-1">
                  <p className="font-medium">{apiKey.name}</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-muted-foreground font-mono">
                      {showKeys[apiKey.id] ? apiKey.key : apiKey.key.replace(/•/g, "•")}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        setShowKeys((prev) => ({ ...prev, [apiKey.id]: !prev[apiKey.id] }))
                      }
                    >
                      {showKeys[apiKey.id] ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Created {new Date(apiKey.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(apiKey.key)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteApiKey(apiKey.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {settings.apiKeys.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No API keys yet. Create one to get started.
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="webhooks" className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Webhooks</CardTitle>
                <CardDescription>Configure webhook endpoints for real-time events</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Webhook
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.webhooks.map((webhook) => (
              <div
                key={webhook.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-muted/30"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="font-medium font-mono text-sm">{webhook.url}</p>
                    <Badge variant={webhook.active ? "default" : "secondary"}>
                      {webhook.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {webhook.events.map((event) => (
                      <Badge key={event} variant="outline" className="text-xs">
                        {event}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={webhook.active}
                    onCheckedChange={() => toggleWebhookActive(webhook.id)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteWebhook(webhook.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {settings.webhooks.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No webhooks configured. Add one to receive real-time events.
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="embed-code" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Embed Code</CardTitle>
            <CardDescription>
              Add this code to your website to integrate the Leaf assistant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Textarea
                value={settings.embedCode}
                readOnly
                rows={10}
                className="font-mono text-sm resize-none"
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(settings.embedCode)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm font-medium mb-2">Installation Instructions:</p>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Copy the embed code above</li>
                <li>Paste it before the closing &lt;/body&gt; tag on your website</li>
                <li>The Leaf widget will appear automatically on your pages</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <Dialog open={showCreateKeyDialog} onOpenChange={setShowCreateKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
            <DialogDescription>
              Give your new API key a name to identify it later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="keyName">Key Name</Label>
              <Input
                id="keyName"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production API Key"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateKeyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createApiKey} disabled={!newKeyName.trim()}>
              Create Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}
