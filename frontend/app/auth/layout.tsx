import type { ReactNode } from "react";
import Link from "next/link";
import { Leaf, MessageCircle, ShoppingBag } from "lucide-react";
import { ThemeCustomizer } from "@/components/theme-customizer";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 p-10 text-white lg:flex">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />

        <Link href="/" className="relative z-10 flex items-center gap-2 text-lg font-semibold text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20 text-white">
            <Leaf className="h-5 w-5" />
          </div>
          Leaf
        </Link>

        <div className="relative z-10 max-w-sm">
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-white">
            Delight your customers, effortlessly
          </h2>
          <p className="mt-4 text-base text-white/80">
            Empower your store with AI-driven chat and voice support that
            recommends products and resolves queries 24/7.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-white">AI-powered conversations</p>
                <p className="text-sm text-white/75">
                  Intelligent chat and voice bots that understand your catalog and customers.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-white">Real-time product recommendations</p>
                <p className="text-sm text-white/75">
                  Personalized suggestions delivered through natural conversation, in 50+ languages.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-white/60">
          © {new Date().getFullYear()} Leaf. All rights reserved.
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-col items-center justify-center p-6 md:p-10 overflow-hidden bg-background">
        {/* Subtle ambient illumination tying right side to brand green */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,oklch(0.65_0.17_155.603_/_0.08),transparent_65%)] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

        {/* Mobile-only logo */}
        <Link href="/" className="absolute left-6 top-6 flex items-center gap-2 text-lg font-semibold text-emerald-500 dark:text-emerald-400 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 dark:bg-emerald-400/10">
            <Leaf className="h-4 w-4" />
          </div>
          Leaf
        </Link>
        <div className="absolute right-4 top-4 z-10">
          <ThemeCustomizer />
        </div>
        {children}
      </div>
    </div>
  );
}
