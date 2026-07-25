"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { GuardrailsConfig as GuardrailsConfigType } from "@/app/(pages)/dashboard/(pages)/bot-config/types";

interface GuardrailsConfigProps {
  config: GuardrailsConfigType;
  onConfigChange: (config: GuardrailsConfigType) => void;
}

export function GuardrailsConfig({ config, onConfigChange }: GuardrailsConfigProps) {
  const [newTopic, setNewTopic] = useState("");
  const [newKeyword, setNewKeyword] = useState("");

  const update = <K extends keyof GuardrailsConfigType>(
    key: K,
    value: GuardrailsConfigType[K]
  ) => {
    onConfigChange({ ...config, [key]: value });
  };

  const addTopic = () => {
    const trimmed = newTopic.trim();
    if (trimmed && !config.blockedTopics.includes(trimmed)) {
      update("blockedTopics", [...config.blockedTopics, trimmed]);
      setNewTopic("");
    }
  };

  const removeTopic = (topic: string) => {
    update(
      "blockedTopics",
      config.blockedTopics.filter((t) => t !== topic)
    );
  };

  const addKeyword = () => {
    const trimmed = newKeyword.trim();
    if (trimmed && !config.blockedKeywords.includes(trimmed)) {
      update("blockedKeywords", [...config.blockedKeywords, trimmed]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    update(
      "blockedKeywords",
      config.blockedKeywords.filter((k) => k !== keyword)
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Content Filtering</CardTitle>
              <CardDescription>
                Control what content the bot can discuss
              </CardDescription>
            </div>
            <Switch
              checked={config.enableContentFilter}
              onCheckedChange={(v) => update("enableContentFilter", v)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Blocked Topics</Label>
            <div className="flex flex-wrap gap-2">
              {config.blockedTopics.map((topic) => (
                <Badge key={topic} variant="destructive" className="gap-1">
                  {topic}
                  <button
                    onClick={() => removeTopic(topic)}
                    className="ml-1 rounded-full hover:bg-destructive-foreground/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="Add blocked topic..."
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTopic())}
                className="max-w-xs"
              />
              <Button size="sm" variant="outline" onClick={addTopic} disabled={!newTopic.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Blocked Keywords</Label>
            <div className="flex flex-wrap gap-2">
              {config.blockedKeywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="gap-1">
                  {keyword}
                  <button
                    onClick={() => removeKeyword(keyword)}
                    className="ml-1 rounded-full hover:bg-muted-foreground/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Add blocked keyword..."
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                className="max-w-xs"
              />
              <Button size="sm" variant="outline" onClick={addKeyword} disabled={!newKeyword.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Safety Controls</CardTitle>
          <CardDescription>
            Enable safety measures to protect conversations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Prevent Personal Information</Label>
              <p className="text-xs text-muted-foreground">
                Block the bot from requesting or sharing personal data like emails, phone numbers, or addresses
              </p>
            </div>
            <Switch
              checked={config.preventPersonalInfo}
              onCheckedChange={(v) => update("preventPersonalInfo", v)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Prevent External Links</Label>
              <p className="text-xs text-muted-foreground">
                Block the bot from sharing or generating external URLs
              </p>
            </div>
            <Switch
              checked={config.preventExternalLinks}
              onCheckedChange={(v) => update("preventExternalLinks", v)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Prevent Competitor Mentions</Label>
              <p className="text-xs text-muted-foreground">
                Prevent the bot from mentioning competitor brands or products
              </p>
            </div>
            <Switch
              checked={config.preventCompetitorMentions}
              onCheckedChange={(v) => update("preventCompetitorMentions", v)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rate Limiting</CardTitle>
          <CardDescription>
            Control message frequency and length limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="maxMessageLength">Max Message Length</Label>
              <Input
                id="maxMessageLength"
                type="number"
                min="100"
                max="10000"
                value={config.maxMessageLength}
                onChange={(e) => update("maxMessageLength", parseInt(e.target.value) || 2000)}
              />
              <p className="text-xs text-muted-foreground">
                Maximum characters allowed per user message
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rateLimitPerMinute">Rate Limit (per minute)</Label>
              <Input
                id="rateLimitPerMinute"
                type="number"
                min="1"
                max="100"
                value={config.rateLimitPerMinute}
                onChange={(e) => update("rateLimitPerMinute", parseInt(e.target.value) || 30)}
              />
              <p className="text-xs text-muted-foreground">
                Maximum messages a user can send per minute
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Disclaimer</CardTitle>
          <CardDescription>
            Add a disclaimer shown with bot responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="customDisclaimer">Custom Disclaimer</Label>
          <Textarea
            id="customDisclaimer"
            value={config.customDisclaimer}
            onChange={(e) => update("customDisclaimer", e.target.value)}
            placeholder="Enter disclaimer text..."
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Leave empty to disable. This text is shown below bot responses.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
