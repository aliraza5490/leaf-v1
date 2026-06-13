"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AIAssistantSettings as AIAssistantSettingsType } from "@/lib/settings/types";

interface AIAssistantSettingsProps {
  settings: AIAssistantSettingsType;
  onSettingsChange: (settings: AIAssistantSettingsType) => void;
}

export function AIAssistantSettings({ settings, onSettingsChange }: AIAssistantSettingsProps) {
  const update = <K extends keyof AIAssistantSettingsType>(
    key: K,
    value: AIAssistantSettingsType[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <Tabs defaultValue="chat-mode" className="w-full">
      <TabsList variant="line">
        <TabsTrigger value="chat-mode">Chat Mode</TabsTrigger>
        <TabsTrigger value="voice-mode">Voice Mode</TabsTrigger>
        <TabsTrigger value="behavior">Behavior</TabsTrigger>
      </TabsList>

      <TabsContent value="chat-mode" className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Chat Mode</CardTitle>
                <CardDescription>Configure the text-based chat assistant</CardDescription>
              </div>
              <Switch
                checked={settings.chatEnabled}
                onCheckedChange={(v) => update("chatEnabled", v)}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="chatGreeting">Greeting Message</Label>
              <Textarea
                id="chatGreeting"
                value={settings.chatGreeting}
                onChange={(e) => update("chatGreeting", e.target.value)}
                placeholder="Enter greeting message..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                This message is shown when a visitor starts a new conversation
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="chatPlaceholder">Input Placeholder</Label>
              <Input
                id="chatPlaceholder"
                value={settings.chatPlaceholder}
                onChange={(e) => update("chatPlaceholder", e.target.value)}
                placeholder="Type your message..."
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="voice-mode" className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Voice Mode</CardTitle>
                <CardDescription>Configure the voice call assistant</CardDescription>
              </div>
              <Switch
                checked={settings.voiceEnabled}
                onCheckedChange={(v) => update("voiceEnabled", v)}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="voiceName">Voice Name</Label>
              <Input
                id="voiceName"
                value={settings.voiceName}
                onChange={(e) => update("voiceName", e.target.value)}
                placeholder="Enter voice assistant name"
              />
            </div>
            <div className="space-y-2">
              <Label>Voice Speed: {settings.voiceSpeed}x</Label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.voiceSpeed}
                onChange={(e) => update("voiceSpeed", parseFloat(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0.5x (Slow)</span>
                <span>1x (Normal)</span>
                <span>2x (Fast)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="behavior" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Behavior</CardTitle>
            <CardDescription>Fine-tune how the AI assistant responds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Response Tone</Label>
              <Select
                value={settings.responseTone}
                onValueChange={(v) =>
                  update("responseTone", v as AIAssistantSettingsType["responseTone"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Max Response Length: {settings.maxResponseLength} chars</Label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={settings.maxResponseLength}
                onChange={(e) => update("maxResponseLength", parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>100 (Short)</span>
                <span>1000 (Medium)</span>
                <span>2000 (Long)</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Product Recommendations</Label>
                <p className="text-xs text-muted-foreground">
                  Allow AI to suggest products during conversations
                </p>
              </div>
              <Switch
                checked={settings.productRecommendations}
                onCheckedChange={(v) => update("productRecommendations", v)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fallbackMessage">Fallback Message</Label>
              <Textarea
                id="fallbackMessage"
                value={settings.fallbackMessage}
                onChange={(e) => update("fallbackMessage", e.target.value)}
                placeholder="Message shown when AI cannot understand the query"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
