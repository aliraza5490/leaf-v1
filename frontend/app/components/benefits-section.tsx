import {
  Bot,
  MessageCircle,
  Sparkles,
  BarChart3,
  Zap,
  Globe,
} from "lucide-react";

const benefits = [
  { icon: Bot, label: "24/7 AI assistance" },
  { icon: MessageCircle, label: "Text & voice chat" },
  { icon: Sparkles, label: "Product recommendations" },
  { icon: BarChart3, label: "Engagement analytics" },
  { icon: Zap, label: "One-click integration" },
  { icon: Globe, label: "Browser-based" },
];

export function BenefitsSection() {
  return (
    <section className="border-y border-border bg-muted/20 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {benefits.map((b) => (
            <div
              key={b.label}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border/80 bg-card/60 p-4 text-center shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:scale-105 transition-all">
                <b.icon className="h-6 w-6" />
              </div>
              <span className="text-sm font-semibold text-foreground/90 group-hover:text-foreground">
                {b.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
