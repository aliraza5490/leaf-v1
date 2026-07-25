"use client";

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
import type { ModelApiConfig as ModelApiConfigType } from "@/app/(pages)/dashboard/(pages)/bot-config/types";
import { availableModels } from "@/mocks/bot-config";

interface ModelApiConfigProps {
  config: ModelApiConfigType;
  onConfigChange: (config: ModelApiConfigType) => void;
}

export function ModelApiConfig({ config, onConfigChange }: ModelApiConfigProps) {
  const update = <K extends keyof ModelApiConfigType>(
    key: K,
    value: ModelApiConfigType[K]
  ) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Model Selection</CardTitle>
          <CardDescription>Choose the AI model for your bot</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Model</Label>
            <Select
              value={config.model}
              onValueChange={(v) => update("model", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Higher capability models are more accurate but slower and more expensive
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generation Parameters</CardTitle>
          <CardDescription>
            Fine-tune how the model generates responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Temperature: {config.temperature.toFixed(1)}</Label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={config.temperature}
              onChange={(e) => update("temperature", parseFloat(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 (Deterministic)</span>
              <span>1 (Balanced)</span>
              <span>2 (Creative)</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Controls randomness. Lower values are more focused, higher values are more creative.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxTokens">Max Tokens: {config.maxTokens}</Label>
            <input
              type="range"
              min="100"
              max="4000"
              step="100"
              value={config.maxTokens}
              onChange={(e) => update("maxTokens", parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>100 (Short)</span>
              <span>2000 (Medium)</span>
              <span>4000 (Long)</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Maximum length of the bot&apos;s response in tokens
            </p>
          </div>

          <div className="space-y-2">
            <Label>Top P: {config.topP.toFixed(1)}</Label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.topP}
              onChange={(e) => update("topP", parseFloat(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 (Narrow)</span>
              <span>0.5</span>
              <span>1 (Broad)</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Nucleus sampling. Lower values focus on more likely tokens.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Frequency Penalty: {config.frequencyPenalty.toFixed(1)}</Label>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={config.frequencyPenalty}
                onChange={(e) => update("frequencyPenalty", parseFloat(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <p className="text-xs text-muted-foreground">
                Reduces repetition of tokens based on frequency
              </p>
            </div>

            <div className="space-y-2">
              <Label>Presence Penalty: {config.presencePenalty.toFixed(1)}</Label>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={config.presencePenalty}
                onChange={(e) => update("presencePenalty", parseFloat(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <p className="text-xs text-muted-foreground">
                Encourages the model to talk about new topics
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>Configure API endpoint and connection settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="apiBaseUrl">API Base URL (Optional)</Label>
            <Input
              id="apiBaseUrl"
              value={config.apiBaseUrl}
              onChange={(e) => update("apiBaseUrl", e.target.value)}
              placeholder="https://api.openai.com/v1"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to use the default provider endpoint. Use this for custom deployments.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="timeoutSeconds">Timeout (seconds)</Label>
              <Input
                id="timeoutSeconds"
                type="number"
                min="5"
                max="120"
                value={config.timeoutSeconds}
                onChange={(e) => update("timeoutSeconds", parseInt(e.target.value) || 30)}
              />
              <p className="text-xs text-muted-foreground">
                Maximum time to wait for a response
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="retryAttempts">Retry Attempts</Label>
              <Input
                id="retryAttempts"
                type="number"
                min="0"
                max="5"
                value={config.retryAttempts}
                onChange={(e) => update("retryAttempts", parseInt(e.target.value) || 3)}
              />
              <p className="text-xs text-muted-foreground">
                Number of retries on failed requests
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
