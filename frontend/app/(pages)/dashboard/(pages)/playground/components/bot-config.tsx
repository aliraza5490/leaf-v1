"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { BotConfig } from "@/app/(pages)/dashboard/(pages)/playground/types";

interface BotConfigPanelProps {
  config: BotConfig;
  onChange: (config: Partial<BotConfig>) => void;
}

const MODEL_OPTIONS = [
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
  { value: "claude-3-haiku", label: "Claude 3 Haiku" },
];

const TONE_OPTIONS = [
  { value: "friendly", label: "Friendly" },
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "formal", label: "Formal" },
  { value: "enthusiastic", label: "Enthusiastic" },
  { value: "empathetic", label: "Empathetic" },
];

const FORMAT_OPTIONS = [
  { value: "text", label: "Plain Text" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
];

export function BotConfigPanel({ config, onChange }: BotConfigPanelProps) {
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-5 p-4">
        <div>
          <h3 className="text-sm font-semibold mb-4">Bot Configuration</h3>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-xs font-medium">Model</Label>
          <Select
            value={config.model}
            onValueChange={(model) => onChange({ model })}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODEL_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-xs font-medium">System Prompt</Label>
          <Textarea
            value={config.systemPrompt}
            onChange={(e) => onChange({ systemPrompt: e.target.value })}
            className="min-h-[120px] text-xs resize-none"
            placeholder="Define the bot's behavior and personality..."
          />
        </div>

        <Separator />

        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Generation
          </h4>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Temperature</Label>
              <span className="text-xs text-muted-foreground tabular-nums">
                {config.temperature.toFixed(1)}
              </span>
            </div>
            <Input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={config.temperature}
              onChange={(e) =>
                onChange({ temperature: parseFloat(e.target.value) })
              }
              className="h-2 accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Precise</span>
              <span>Creative</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Max Tokens</Label>
            </div>
            <Input
              type="number"
              min={1}
              max={4096}
              value={config.maxTokens}
              onChange={(e) =>
                onChange({ maxTokens: parseInt(e.target.value) || 1024 })
              }
              className="h-9 text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Top P</Label>
              <span className="text-xs text-muted-foreground tabular-nums">
                {config.topP.toFixed(2)}
              </span>
            </div>
            <Input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.topP}
              onChange={(e) =>
                onChange({ topP: parseFloat(e.target.value) })
              }
              className="h-2 accent-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Frequency Penalty</Label>
              <span className="text-xs text-muted-foreground tabular-nums">
                {config.frequencyPenalty.toFixed(1)}
              </span>
            </div>
            <Input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={config.frequencyPenalty}
              onChange={(e) =>
                onChange({ frequencyPenalty: parseFloat(e.target.value) })
              }
              className="h-2 accent-primary"
            />
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Personality
          </h4>

          <div className="flex flex-col gap-2">
            <Label className="text-xs font-medium">Tone</Label>
            <Select
              value={config.tone}
              onValueChange={(tone) => onChange({ tone })}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TONE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Knowledge & Data
          </h4>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <Label className="text-xs font-medium">Product Catalog</Label>
              <span className="text-[10px] text-muted-foreground">
                Allow bot to recommend products
              </span>
            </div>
            <Switch
              checked={config.enableProducts}
              onCheckedChange={(enableProducts) =>
                onChange({ enableProducts })
              }
            />
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Output
          </h4>

          <div className="flex flex-col gap-2">
            <Label className="text-xs font-medium">Response Format</Label>
            <Select
              value={config.responseFormat}
              onValueChange={(responseFormat) =>
                onChange({
                  responseFormat: responseFormat as BotConfig["responseFormat"],
                })
              }
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FORMAT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Guardrails
          </h4>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <Label className="text-xs font-medium">Block Profanity</Label>
              <span className="text-[10px] text-muted-foreground">
                Filter inappropriate language
              </span>
            </div>
            <Switch
              checked={config.guardrails.blockProfanity}
              onCheckedChange={(checked) =>
                onChange({
                  guardrails: { ...config.guardrails, blockProfanity: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <Label className="text-xs font-medium">Block PII</Label>
              <span className="text-[10px] text-muted-foreground">
                Prevent sharing personal information
              </span>
            </div>
            <Switch
              checked={config.guardrails.blockPII}
              onCheckedChange={(checked) =>
                onChange({
                  guardrails: { ...config.guardrails, blockPII: checked },
                })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Max Retries</Label>
            </div>
            <Input
              type="number"
              min={0}
              max={5}
              value={config.guardrails.maxRetries}
              onChange={(e) =>
                onChange({
                  guardrails: {
                    ...config.guardrails,
                    maxRetries: parseInt(e.target.value) || 0,
                  },
                })
              }
              className="h-9 text-sm"
            />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
