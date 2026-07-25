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
    <section className="border-y border-border bg-muted/30 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {benefits.map((b) => (
            <div
              key={b.label}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <b.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-foreground">
                {b.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
