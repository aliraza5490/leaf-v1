"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { SystemPromptConfig as SystemPromptConfigType } from "@/app/(pages)/dashboard/(pages)/bot-config/types";
import { availableLanguages, personalityOptions } from "@/mocks/bot-config";

interface SystemPromptConfigProps {
  config: SystemPromptConfigType;
  onConfigChange: (config: SystemPromptConfigType) => void;
}

export function SystemPromptConfig({ config, onConfigChange }: SystemPromptConfigProps) {
  const update = <K extends keyof SystemPromptConfigType>(
    key: K,
    value: SystemPromptConfigType[K]
  ) => {
    onConfigChange({ ...config, [key]: value });
  };

  const addTrait = (trait: string) => {
    if (!config.personalityTraits.includes(trait)) {
      update("personalityTraits", [...config.personalityTraits, trait]);
    }
  };

  const removeTrait = (trait: string) => {
    update(
      "personalityTraits",
      config.personalityTraits.filter((t) => t !== trait)
    );
  };

  const availableTraits = personalityOptions.filter(
    (t) => !config.personalityTraits.includes(t)
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bot Identity</CardTitle>
          <CardDescription>Define your bot&apos;s name and personality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="botName">Bot Name</Label>
            <Input
              id="botName"
              value={config.botName}
              onChange={(e) => update("botName", e.target.value)}
              placeholder="Enter bot name..."
            />
            <p className="text-xs text-muted-foreground">
              The name displayed to users during conversations
            </p>
          </div>

          <div className="space-y-2">
            <Label>Response Tone</Label>
            <Select
              value={config.responseTone}
              onValueChange={(v) =>
                update("responseTone", v as SystemPromptConfigType["responseTone"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="empathetic">Empathetic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Language</Label>
            <Select
              value={config.language}
              onValueChange={(v) => update("language", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableLanguages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Personality Traits</Label>
            <div className="flex flex-wrap gap-2">
              {config.personalityTraits.map((trait) => (
                <Badge key={trait} variant="secondary" className="gap-1">
                  {trait}
                  <button
                    onClick={() => removeTrait(trait)}
                    className="ml-1 rounded-full hover:bg-muted-foreground/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {availableTraits.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {availableTraits.map((trait) => (
                  <Badge
                    key={trait}
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => addTrait(trait)}
                  >
                    + {trait}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Prompt</CardTitle>
          <CardDescription>
            Define the instructions that guide your bot&apos;s behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="systemPrompt">Prompt Instructions</Label>
            <Textarea
              id="systemPrompt"
              value={config.systemPrompt}
              onChange={(e) => update("systemPrompt", e.target.value)}
              placeholder="Enter system prompt..."
              rows={12}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              {config.systemPrompt.length} characters. Be specific about the bot&apos;s role,
              tone, and limitations.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Knowledge Sources</CardTitle>
          <CardDescription>
            Choose what information the bot can access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Product Knowledge</Label>
              <p className="text-xs text-muted-foreground">
                Allow bot to access and recommend products from your catalog
              </p>
            </div>
            <Checkbox
              checked={config.includeProductKnowledge}
              onCheckedChange={(v) => update("includeProductKnowledge", v === true)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Store Information</Label>
              <p className="text-xs text-muted-foreground">
                Allow bot to answer questions about store policies, hours, and contact info
              </p>
            </div>
            <Checkbox
              checked={config.includeStoreInfo}
              onCheckedChange={(v) => update("includeStoreInfo", v === true)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
