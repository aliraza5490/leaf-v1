import { LucideIcon } from "lucide-react";
import {
  MessageSquare,
  Phone,
  Mic,
  Package,
  UploadCloud,
  CheckCircle2,
  Brain,
  Sparkles,
  Languages,
  BarChart3,
  TrendingUp,
  Users,
  ShieldCheck,
  Layers,
  Cpu,
  Globe,
  ArrowRight,
  Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureVisualProps {
  icons: LucideIcon[];
  label: string;
}

export function FeatureVisual({ icons, label }: FeatureVisualProps) {
  return (
    <div className="relative flex items-center justify-center w-full">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border/80 bg-card/80 p-5 sm:p-6 shadow-xl backdrop-blur-xs transition-all hover:border-primary/40 hover:shadow-2xl">
        {/* Background glow gradient */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />

        {/* Feature-specific Mini UI Component / Visualization */}
        {label === "01" && <DualInterfaceVisual />}
        {label === "02" && <ProductManagementVisual />}
        {label === "03" && <IntelligenceVisual />}
        {label === "04" && <DashboardVisual />}
        {label === "05" && <EnterpriseVisual />}

        {/* Generic Fallback if label is unknown */}
        {!["01", "02", "03", "04", "05"].includes(label) && (
          <GenericVisual icons={icons} label={label} />
        )}
      </div>
    </div>
  );
}

{/* Feature 01 Visual: Dual Interface Mode (Text Chat + Live Voice Call) */}
function DualInterfaceVisual() {
  return (
    <div className="space-y-4">
      {/* Top Header Mode Toggle */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-foreground/90 uppercase tracking-wider">
            Dual Interface Active
          </span>
        </div>
        <div className="flex rounded-lg bg-muted p-1 gap-1">
          <span className="flex items-center gap-1 text-[11px] font-semibold bg-background text-foreground px-2 py-0.5 rounded shadow-xs">
            <MessageSquare className="h-3 w-3 text-primary" /> Chat
          </span>
          <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground px-2 py-0.5">
            <Phone className="h-3 w-3" /> Voice
          </span>
        </div>
      </div>

      {/* Mini Chat Stream & Voice Widget */}
      <div className="space-y-2.5">
        {/* Customer bubble */}
        <div className="flex justify-end">
          <div className="rounded-2xl rounded-tr-xs bg-primary px-3 py-2 text-xs text-primary-foreground max-w-[80%] font-medium">
            Can you show me the specs for headphones?
          </div>
        </div>

        {/* AI Assistant Bubble */}
        <div className="flex items-start gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-[10px] font-bold">
            AI
          </div>
          <div className="rounded-2xl rounded-tl-xs bg-muted/80 px-3 py-2 text-xs text-foreground/90 max-w-[85%] border border-border/40">
            <p className="font-semibold text-primary text-[11px]">Wireless Pro ANC</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">30hr battery • Active Noise Cancelling • $149</p>
          </div>
        </div>

        {/* Live Voice Call Bar Pill */}
        <div className="mt-3 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Mic className="h-3.5 w-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-foreground">Live Voice Call</span>
                <span className="text-[10px] text-emerald-500 font-mono font-medium">01:42</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Real-time speech transcription...</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-3 w-1 bg-primary/60 rounded-full animate-bounce" />
            <span className="h-5 w-1 bg-primary rounded-full animate-bounce [animation-delay:0.1s]" />
            <span className="h-2 w-1 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
          </div>
        </div>
      </div>
    </div>
  );
}

{/* Feature 02 Visual: Product Management Catalog */}
function ProductManagementVisual() {
  return (
    <div className="space-y-3.5">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">Product Catalog</span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500 border border-emerald-500/20">
          <UploadCloud className="h-3 w-3" /> Auto-Synced
        </span>
      </div>

      {/* Catalog items */}
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 p-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-card border border-border text-sm">
              🎧
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Studio Headset Pro</p>
              <p className="text-[10px] text-muted-foreground">SKU: HD-902 • 14 FAQs Synced</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-foreground">$199.00</span>
            <span className="block text-[10px] text-emerald-500 font-medium">In Stock</span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 p-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-card border border-border text-sm">
              ⌚
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Aura Smartwatch v2</p>
              <p className="text-[10px] text-muted-foreground">SKU: SW-401 • 8 Attributes</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-foreground">$299.00</span>
            <span className="block text-[10px] text-primary font-medium">Auto-Categorized</span>
          </div>
        </div>
      </div>

      {/* CSV Sync Footer indicator */}
      <div className="flex items-center justify-between rounded-lg bg-primary/5 px-3 py-2 border border-primary/20">
        <span className="text-[11px] font-medium text-foreground/90">Bulk CSV & API Sync</span>
        <span className="text-[10px] font-bold text-primary">1,420 Items Ready</span>
      </div>
    </div>
  );
}

{/* Feature 03 Visual: Intelligence & Personalization Workflow */}
function IntelligenceVisual() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">AI Intelligence Engine</span>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          <Languages className="h-3 w-3" /> 50+ Languages
        </span>
      </div>

      {/* Pipeline Diagram Flow */}
      <div className="relative space-y-2 py-1">
        {/* Step 1 */}
        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 px-3 py-2">
          <span className="text-[11px] font-medium text-muted-foreground">Context Input</span>
          <span className="text-xs font-semibold text-foreground">"Looking for trail running shoes"</span>
        </div>

        {/* Connecting Arrow */}
        <div className="flex justify-center text-primary/60">
          <ArrowRight className="h-3.5 w-3.5 rotate-90" />
        </div>

        {/* Step 2 Neural Node */}
        <div className="relative rounded-xl border border-primary/40 bg-gradient-to-r from-primary/15 via-primary/5 to-primary/15 p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Contextual Recommendation Matrix
          </div>
          <div className="mt-1 flex justify-center gap-2 text-[10px] text-foreground/80 font-medium">
            <span>• Sentiment Analysis</span>
            <span>• Intent Match 99.8%</span>
          </div>
        </div>

        {/* Connecting Arrow */}
        <div className="flex justify-center text-primary/60">
          <ArrowRight className="h-3.5 w-3.5 rotate-90" />
        </div>

        {/* Step 3 Personalised Output */}
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-3 py-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-xs font-semibold text-foreground">Air Zoom Trail X ($129)</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-500">98% Match</span>
        </div>
      </div>
    </div>
  );
}

{/* Feature 04 Visual: Store Owner Dashboard Data Visualization */}
function DashboardVisual() {
  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">Analytics Command Center</span>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
          <TrendingUp className="h-3 w-3" /> +24% vs Last Week
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-xl border border-border/60 bg-muted/40 p-2.5">
          <p className="text-[10px] font-medium text-muted-foreground">Active Conversations</p>
          <p className="text-lg font-bold text-foreground">1,842</p>
          <p className="text-[10px] text-emerald-500 font-medium">↑ 14% conversion rate</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-muted/40 p-2.5">
          <p className="text-[10px] font-medium text-muted-foreground">Avg Response Speed</p>
          <p className="text-lg font-bold text-foreground">0.8s</p>
          <p className="text-[10px] text-primary font-medium">Instant AI resolutions</p>
        </div>
      </div>

      {/* Mini Bar Chart Data Visualization */}
      <div className="rounded-xl border border-border/60 bg-muted/20 p-2.5">
        <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground mb-2">
          <span>Weekly Traffic Overview</span>
          <span className="text-foreground font-semibold">Peak: 482 chats/hr</span>
        </div>
        <div className="flex items-end justify-between gap-1.5 h-12 pt-2">
          {[40, 65, 55, 85, 70, 95, 80].map((height, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-xs bg-primary/70 hover:bg-primary transition-all"
                style={{ height: `${height}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

{/* Feature 05 Visual: Enterprise Features Architecture */}
function EnterpriseVisual() {
  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">Enterprise Ecosystem</span>
        </div>
        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          99.99% SLA Uptime
        </span>
      </div>

      {/* Grid of Enterprise Capabilities */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 p-2.5">
          <Globe className="h-4 w-4 text-primary shrink-0" />
          <div>
            <p className="text-xs font-semibold text-foreground">White-Label</p>
            <p className="text-[10px] text-muted-foreground">Custom branding</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 p-2.5">
          <Users className="h-4 w-4 text-primary shrink-0" />
          <div>
            <p className="text-xs font-semibold text-foreground">Human Handoff</p>
            <p className="text-[10px] text-muted-foreground">Live agent routing</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 p-2.5">
          <Layers className="h-4 w-4 text-primary shrink-0" />
          <div>
            <p className="text-xs font-semibold text-foreground">REST API</p>
            <p className="text-[10px] text-muted-foreground">Webhooks & CRM</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 p-2.5">
          <Cpu className="h-4 w-4 text-primary shrink-0" />
          <div>
            <p className="text-xs font-semibold text-foreground">Dedicated Node</p>
            <p className="text-[10px] text-muted-foreground">High performance</p>
          </div>
        </div>
      </div>

      {/* Security Banner */}
      <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span className="text-xs font-semibold text-foreground">SOC2 Compliant & End-to-End Encrypted</span>
        </div>
      </div>
    </div>
  );
}

{/* Generic Fallback */}
function GenericVisual({ icons, label }: FeatureVisualProps) {
  return (
    <div className="relative flex h-64 w-full items-center justify-center rounded-2xl bg-muted/30">
      <div className="relative grid grid-cols-2 gap-4">
        {icons.map((Icon, i) => (
          <div
            key={i}
            className={cn(
              "flex h-24 w-24 items-center justify-center rounded-2xl border border-border bg-card shadow-sm sm:h-28 sm:w-28",
              i === 0 && "translate-y-2",
              i === 1 && "-translate-y-2"
            )}
          >
            <Icon className="h-10 w-10 text-primary" />
          </div>
        ))}
      </div>
      <span className="absolute bottom-4 right-4 text-6xl font-bold text-primary/5">
        {label}
      </span>
    </div>
  );
}
