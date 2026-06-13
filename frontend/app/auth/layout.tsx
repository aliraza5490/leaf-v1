import type { ReactNode } from "react";
import { Leaf, Shield, Zap } from "lucide-react";
import { ThemeCustomizer } from "@/components/theme-customizer";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--primary-foreground)/0.15,transparent_40%),radial-gradient(circle_at_bottom_left,var(--primary-foreground)/0.1,transparent_50%)]" />
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary-foreground/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-primary-foreground/10 blur-3xl" />

        <div className="relative z-10 flex items-center gap-2 text-lg font-semibold">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-foreground/20 backdrop-blur-sm">
            <Leaf className="h-5 w-5" />
          </div>
          Leaf
        </div>

        <div className="relative z-10 max-w-sm">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight">
            Build faster, ship smarter
          </h2>
          <p className="mt-4 text-base text-primary-foreground/80">
            Join thousands of teams using Leaf to streamline workflows and
            deliver exceptional products.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Lightning fast setup</p>
                <p className="text-sm text-primary-foreground/70">
                  Get started in minutes, not hours.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Enterprise-grade security</p>
                <p className="text-sm text-primary-foreground/70">
                  Your data is protected by industry-leading practices.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-primary-foreground/60">
          © {new Date().getFullYear()} Leaf. All rights reserved.
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-col items-center justify-center p-6 md:p-10">
        {/* Mobile-only logo */}
        <div className="absolute left-6 top-6 flex items-center gap-2 text-lg font-semibold text-primary lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
            <Leaf className="h-4 w-4" />
          </div>
          Leaf
        </div>
        <div className="absolute right-4 top-4">
          <ThemeCustomizer />
        </div>
        {children}
      </div>
    </div>
  );
}
