"use client";

import Link from "next/link";
import {
  Leaf,
  Bot,
  MessageCircle,
  Phone,
  Package,
  Brain,
  LayoutDashboard,
  Building2,
  Sparkles,
  Send,
  Globe,
  BarChart3,
  Shield,
  CheckCircle2,
  Upload,
  Zap,
  ImageIcon,
  Rocket,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeCustomizer } from "@/components/theme-customizer";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useState } from "react";

const benefits = [
  { icon: Bot, label: "24/7 AI assistance" },
  { icon: MessageCircle, label: "Text & voice chat" },
  { icon: Sparkles, label: "Product recommendations" },
  { icon: BarChart3, label: "Engagement analytics" },
  { icon: Zap, label: "One-click integration" },
  { icon: Globe, label: "Browser-based" },
];

const features = [
  {
    label: "01",
    title: "Dual Interface Mode",
    description:
      "Let your customers choose how they want to interact — through a rich text chat or a live voice call, right from their browser.",
    bullets: [
      "Real-time text conversation with product cards, images, and prices",
      "Voice calling with voice-to-text and text-to-speech",
      "Chat history and session management",
      "Responsive design for mobile and desktop",
    ],
    icons: [MessageCircle, Phone],
  },
  {
    label: "02",
    title: "Product Management",
    description:
      "Import your entire catalog in minutes and keep it synced across every customer interaction automatically.",
    bullets: [
      "Bulk upload via CSV, JSON, or API",
      "Link products with descriptions, FAQs, and attributes",
      "Organize by category, tags, and custom attributes",
      "Automatic image optimization and display",
    ],
    icons: [Package, Upload],
  },
  {
    label: "03",
    title: "Intelligence & Personalization",
    description:
      "Leaf understands context, learns preferences, and delivers recommendations that feel personal — in over 50 languages.",
    bullets: [
      "AI-driven product suggestions from conversation context",
      "Custom knowledge base trained on your store data",
      "Multi-language support across 50+ languages",
      "Conversation analytics to understand customer needs",
    ],
    icons: [Brain, Sparkles],
  },
  {
    label: "04",
    title: "Store Owner Dashboard",
    description:
      "A centralized command center for managing your AI assistant, tracking performance, and understanding your customers.",
    bullets: [
      "Real-time analytics and visitor insights",
      "Product catalog and knowledge base editor",
      "Conversation logs and full transcripts",
      "Team member management and permissions",
    ],
    icons: [LayoutDashboard, BarChart3],
  },
  {
    label: "05",
    title: "Enterprise Features",
    description:
      "Scale with confidence using custom branding, API access, and enterprise-grade integrations built for growing businesses.",
    bullets: [
      "Custom branding to match your store identity",
      "Conversation routing to human agents",
      "API access for CRM, inventory, and order systems",
      "Webhooks and white-label options for resellers",
    ],
    icons: [Building2, Shield],
  },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between pl-0 pr-4 sm:pr-6 lg:pr-8">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Leaf</span>
          </Link>

          <nav className="flex items-center gap-4">
            <ThemeCustomizer />
            {isAuthenticated ? (
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Get started</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--primary)/0.08,transparent_60%)]" />
          <div className="relative mx-auto max-w-6xl">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left — Copy */}
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-sm text-muted-foreground">
                  <Bot className="h-4 w-4" />
                  <span>AI-Powered E-Commerce Assistant</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Your store&apos;s AI assistant,{" "}
                  <span className="text-primary">always ready.</span>
                </h1>
                <p className="mt-6 max-w-lg text-lg text-muted-foreground">
                  Leaf gives your customers a chatbot and voice bot that
                  understands your products. Visitors get instant answers and
                  personalized recommendations — through text or voice, directly
                  on your website.
                </p>
                <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row">
                  {isAuthenticated ? (
                    <Button size="lg" asChild>
                      <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                  ) : (
                    <>
                      <Button size="lg" asChild>
                        <Link href="/auth/signup">Get started for free</Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild>
                        <Link href="/auth/login">Sign in</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Right — Chat Mockup */}
              <div className="hidden lg:block">
                <ChatMockup />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Strip */}
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

        {/* Features — Alternating Sections */}
        <div className="divide-y divide-border">
          {features.map((feature, i) => (
            <FeatureSection key={feature.label} feature={feature} reverse={i % 2 === 1} />
          ))}
        </div>

        {/* Beta Enrollment */}
        <BetaSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-primary">
            <Leaf className="h-5 w-5" />
            <span className="font-semibold">Leaf</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Leaf. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function ChatMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-lg">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3 border-b border-border pb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Leaf AI</p>
            <p className="text-xs text-muted-foreground">Online now</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex flex-col gap-3">
          {/* User message */}
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
              Looking for wireless headphones under $100
            </div>
          </div>

          {/* AI response */}
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5 text-sm text-muted-foreground">
              I found some great options! Here&apos;s our top pick:
            </div>
          </div>

          {/* Product card */}
          <div className="flex justify-start">
            <div className="w-[85%] overflow-hidden rounded-xl border border-border bg-background">
              <div className="flex h-28 items-center justify-center bg-muted/50">
                <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-foreground">
                  SoundPro Wireless
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  30hr battery · Noise cancelling
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">$79.99</span>
                  <span className="rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                    Add to cart
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* User follow-up */}
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
              Perfect, add it!
            </div>
          </div>
        </div>

        {/* Input bar */}
        <div className="mt-4 flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2">
          <span className="flex-1 text-xs text-muted-foreground/60">
            Type a message...
          </span>
          <Send className="h-4 w-4 text-primary" />
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
    </div>
  );
}

function FeatureSection({
  feature,
  reverse,
}: {
  feature: (typeof features)[number];
  reverse: boolean;
}) {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div
        className={cn(
          "mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16",
          reverse && "lg:[&>*:first-child]:order-2"
        )}
      >
        {/* Visual side */}
        <FeatureVisual icons={feature.icons} label={feature.label} />

        {/* Text side */}
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            {feature.label} — Feature
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {feature.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {feature.description}
          </p>
          <ul className="mt-6 space-y-3">
            {feature.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm text-muted-foreground">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function FeatureVisual({
  icons,
  label,
}: {
  icons: (typeof features)[number]["icons"];
  label: string;
}) {
  return (
    <div className="relative flex items-center justify-center">
      <div className="relative flex h-64 w-64 items-center justify-center rounded-3xl border border-border bg-muted/30 sm:h-72 sm:w-72">
        <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_center,var(--primary)/0.06,transparent_70%)]" />
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
    </div>
  );
}

function BetaSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="relative overflow-hidden border-t border-border bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,var(--primary)/0.06,transparent_60%)]" />
      <div className="relative mx-auto max-w-2xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary">
          <Rocket className="h-4 w-4" />
          <span>Beta Access</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Be among the first to try Leaf
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          We&apos;re opening up beta testing soon. Sign up to get early access
          and help shape the future of AI-powered e-commerce.
        </p>

        {submitted ? (
          <div className="mt-8 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-sm text-foreground">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            You&apos;re on the list! We&apos;ll be in touch soon.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <Input
              type="email"
              placeholder="you@store.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" size="lg">
              Join Beta
            </Button>
          </form>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          No spam. We&apos;ll only email you about beta access and launch updates.
        </p>
      </div>
    </section>
  );
}
