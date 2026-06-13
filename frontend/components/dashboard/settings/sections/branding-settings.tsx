"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BrandingSettings as BrandingSettingsType } from "@/lib/settings/types";
import { fontFamilies } from "@/lib/settings/mock-data";

interface BrandingSettingsProps {
  settings: BrandingSettingsType;
  onSettingsChange: (settings: BrandingSettingsType) => void;
}

export function BrandingSettings({ settings, onSettingsChange }: BrandingSettingsProps) {
  const update = <K extends keyof BrandingSettingsType>(
    key: K,
    value: BrandingSettingsType[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <Tabs defaultValue="appearance" className="w-full">
      <TabsList variant="line">
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="widget">Widget</TabsTrigger>
        <TabsTrigger value="custom-css">Custom CSS</TabsTrigger>
      </TabsList>

      <TabsContent value="appearance" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the visual identity of your assistant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Logo</Label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-lg border border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/30">
                  {settings.logoUrl ? (
                    <img
                      src={settings.logoUrl}
                      alt="Logo"
                      className="h-12 w-12 object-contain"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">No logo</span>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    value={settings.logoUrl}
                    onChange={(e) => update("logoUrl", e.target.value)}
                    placeholder="https://your-store.com/logo.png"
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 128x128px, PNG or SVG format
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => update("primaryColor", e.target.value)}
                    className="h-10 w-10 rounded cursor-pointer border"
                  />
                  <Input
                    id="primaryColor"
                    value={settings.primaryColor}
                    onChange={(e) => update("primaryColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => update("secondaryColor", e.target.value)}
                    className="h-10 w-10 rounded cursor-pointer border"
                  />
                  <Input
                    id="secondaryColor"
                    value={settings.secondaryColor}
                    onChange={(e) => update("secondaryColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select value={settings.fontFamily} onValueChange={(v) => update("fontFamily", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilies.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="widget" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Widget Settings</CardTitle>
            <CardDescription>Configure the chat widget appearance and behavior</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Widget Position</Label>
              <RadioGroup
                value={settings.widgetPosition}
                onValueChange={(v) =>
                  update("widgetPosition", v as BrandingSettingsType["widgetPosition"])
                }
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bottom-right" id="bottom-right" />
                  <Label htmlFor="bottom-right" className="cursor-pointer">
                    Bottom Right
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bottom-left" id="bottom-left" />
                  <Label htmlFor="bottom-left" className="cursor-pointer">
                    Bottom Left
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-3">
              <Label>Widget Style</Label>
              <RadioGroup
                value={settings.widgetStyle}
                onValueChange={(v) =>
                  update("widgetStyle", v as BrandingSettingsType["widgetStyle"])
                }
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bubble" id="bubble" />
                  <Label htmlFor="bubble" className="cursor-pointer">
                    Bubble
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expanded" id="expanded" />
                  <Label htmlFor="expanded" className="cursor-pointer">
                    Expanded
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Leaf Branding</Label>
                <p className="text-xs text-muted-foreground">
                  Display &quot;Powered by Leaf&quot; in the widget
                </p>
              </div>
              <Switch
                checked={settings.showBranding}
                onCheckedChange={(v) => update("showBranding", v)}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="custom-css" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Custom CSS</CardTitle>
            <CardDescription>Add custom styles to further customize the widget</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={settings.customCSS}
              onChange={(e) => update("customCSS", e.target.value)}
              placeholder=".leaf-widget { /* your custom styles */ }"
              rows={12}
              className="font-mono text-sm resize-none"
            />
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm font-medium mb-2">CSS Variables Available:</p>
              <div className="text-xs text-muted-foreground space-y-1 font-mono">
                <p>--leaf-primary: Primary brand color</p>
                <p>--leaf-secondary: Secondary brand color</p>
                <p>--leaf-font: Font family</p>
                <p>--leaf-radius: Border radius</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
