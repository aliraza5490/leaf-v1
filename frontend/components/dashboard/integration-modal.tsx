"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Code, Copy, Check, Terminal, ExternalLink, Settings2, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMe } from "@/lib/auth/service";

const COLOR_PRESETS = [
  { name: "Emerald", value: "#10b981" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Amber", value: "#f59e0b" },
];

export function IntegrationModal() {
  const [storeId, setStoreId] = useState<number>(1);
  const [primaryColor, setPrimaryColor] = useState("#10b981");
  const [position, setPosition] = useState<"bottom-right" | "bottom-left">("bottom-right");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [storeName, setStoreName] = useState("Leaf Demo Store");
  const [greeting, setGreeting] = useState(
    "Hi! I'm Leaf, your AI shopping assistant. How can I help you today?"
  );
  const [scriptType, setScriptType] = useState<"production" | "development">("production");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getMe();
        if (profile && profile.store_id) {
          setStoreId(profile.store_id);
        }
      } catch (err) {
        console.error("Failed to load user profile in IntegrationModal:", err);
      }
    }
    loadProfile();
  }, []);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
  const scriptUrl =
    scriptType === "production"
      ? "https://cdn.leaf.ai/leaf-widget.js"
      : "http://localhost:5174/leaf-widget.js";

  const generatedSnippet = `<script src="${scriptUrl}"></script>
<script>
  window.addEventListener('DOMContentLoaded', () => {
    if (window.Leaf) {
      window.Leaf.init({
        storeId: ${storeId},
        apiUrl: '${apiBaseUrl}',
        position: '${position}',
        theme: '${theme}',
        primaryColor: '${primaryColor}',
        storeName: '${storeName.replace(/'/g, "\\'")}',
        greeting: '${greeting.replace(/'/g, "\\'")}',
        showBranding: true,
      });
    }
  });
</script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSnippet);
    setCopied(true);
    toast.success("Snippet copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 h-9 border-dashed border-primary/40 hover:border-primary/80 hover:bg-primary/5 transition-all duration-300">
          <Code className="h-4 w-4 text-primary" />
          <span>Integration</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-4xl p-0 overflow-hidden bg-background">
        <DialogTitle className="sr-only">Leaf Widget Integration</DialogTitle>
        <DialogDescription className="sr-only">
          Configure and copy the script snippet to integrate the Leaf chat widget onto your website.
        </DialogDescription>
        <div className="flex flex-col md:flex-row h-[85vh] md:h-[600px]">
          {/* Left panel: Customizer */}
          <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-r border-border p-6 flex flex-col gap-6 overflow-y-auto bg-muted/20">
            <div className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-primary animate-pulse" />
              <h2 className="font-semibold text-lg">Configure Widget</h2>
            </div>
            
            <div className="space-y-4">
              {/* Store Name */}
              <div className="space-y-2">
                <Label htmlFor="storeName" className="text-sm font-medium">Store Name</Label>
                <Input
                  id="storeName"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Leaf Demo Store"
                  className="bg-background"
                />
              </div>

              {/* Greeting */}
              <div className="space-y-2">
                <Label htmlFor="greeting" className="text-sm font-medium">Greeting Message</Label>
                <Input
                  id="greeting"
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  placeholder="Greeting..."
                  className="bg-background"
                />
              </div>

              {/* Theme Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Theme</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={theme === "light" ? "default" : "outline"}
                    className="w-full h-8 text-xs font-medium"
                    onClick={() => setTheme("light")}
                  >
                    Light
                  </Button>
                  <Button
                    type="button"
                    variant={theme === "dark" ? "default" : "outline"}
                    className="w-full h-8 text-xs font-medium"
                    onClick={() => setTheme("dark")}
                  >
                    Dark
                  </Button>
                </div>
              </div>

              {/* Widget Position */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Position</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={position === "bottom-right" ? "default" : "outline"}
                    className="w-full h-8 text-xs font-medium"
                    onClick={() => setPosition("bottom-right")}
                  >
                    Bottom Right
                  </Button>
                  <Button
                    type="button"
                    variant={position === "bottom-left" ? "default" : "outline"}
                    className="w-full h-8 text-xs font-medium"
                    onClick={() => setPosition("bottom-left")}
                  >
                    Bottom Left
                  </Button>
                </div>
              </div>

              {/* Primary Color Customization */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Primary Color</Label>
                <div className="flex flex-wrap items-center gap-2">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      className="w-6 h-6 rounded-full border border-border relative flex items-center justify-center transition-transform hover:scale-110"
                      style={{ backgroundColor: color.value }}
                      onClick={() => setPrimaryColor(color.value)}
                      title={color.name}
                    >
                      {primaryColor === color.value && (
                        <Check className="h-3 w-3 text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                  <div className="ml-auto flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded border border-border overflow-hidden relative">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer opacity-0"
                      />
                      <div
                        className="w-full h-full"
                        style={{ backgroundColor: primaryColor }}
                      />
                    </div>
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-20 h-7 text-xs px-1.5 py-0 bg-background text-center font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto p-3 rounded-lg bg-primary/5 border border-primary/10 flex gap-2.5 items-start">
              <Info className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Changes made here dynamically customize your widget initialization object.
              </p>
            </div>
          </div>

          {/* Right panel: Code Snippet & Instructions */}
          <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
            <div>
              <h3 className="font-semibold text-lg">Embed Code</h3>
              <p className="text-sm text-muted-foreground">
                Copy the code below and place it before the closing <code className="bg-muted px-1 py-0.5 rounded text-xs">&lt;/body&gt;</code> tag of your page.
              </p>
            </div>

            <Tabs
              value={scriptType}
              onValueChange={(val) => setScriptType(val as "production" | "development")}
              className="w-full"
            >
              <div className="flex items-center justify-between border-b border-border pb-1">
                <TabsList variant="line" className="h-8 p-0">
                  <TabsTrigger
                    value="production"
                    className="h-8 rounded-none px-1 text-xs"
                  >
                    <ExternalLink />
                    Production CDN
                  </TabsTrigger>
                  <TabsTrigger
                    value="development"
                    className="h-8 rounded-none px-1 text-xs"
                  >
                    <Terminal />
                    Local Dev
                  </TabsTrigger>
                </TabsList>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span>Store ID:</span>
                  <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground font-semibold">
                    {storeId}
                  </span>
                </div>
              </div>

              <div className="relative mt-3 group">
                <Textarea
                  value={generatedSnippet}
                  readOnly
                  className="font-mono text-[11.5px] leading-relaxed p-4 bg-muted/60 border border-border rounded-lg resize-none h-[220px] focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button
                  size="sm"
                  onClick={copyToClipboard}
                  className="absolute top-3 right-3 shadow-sm hover:scale-105 transition-transform"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </Tabs>

            <div className="rounded-lg bg-muted/30 p-4 border border-border/40">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Quick Integration Steps:
              </h4>
              <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>
                  Copy the generated integration script above.
                </li>
                <li>
                  Paste it in the <code className="bg-muted px-1 py-0.5 rounded">&lt;body&gt;</code> element of your website HTML.
                </li>
                <li>
                  Verify the widget displays dynamically in the {position === "bottom-right" ? "bottom-right" : "bottom-left"} corner.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
