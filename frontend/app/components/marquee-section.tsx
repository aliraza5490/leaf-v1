"use client";

import React from "react";
import Marquee from "@/components/8starlabs-ui/marquee";
import {
  VercelLightIcon,
  ShopifyIcon,
  StripeIcon,
  GitHubIcon,
  SupabaseIcon,
  NextjsIcon,
} from "@/components/icons";

export function MarqueeSection() {
  const brandLogos = [
    { icon: VercelLightIcon, name: "Vercel" },
    { icon: ShopifyIcon, name: "Shopify" },
    { icon: StripeIcon, name: "Stripe" },
    { icon: GitHubIcon, name: "GitHub" },
    { icon: SupabaseIcon, name: "Supabase" },
    { icon: NextjsIcon, name: "Next.js" },
  ];

  return (
    <section className="py-10 bg-background border-y border-border/40 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 text-center mb-6">
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Trusted by modern businesses & developers
        </p>
      </div>
      <Marquee grayscale={true} fade={true} pauseOnHover={true}>
        {brandLogos.map((brand, idx) => {
          const Icon = brand.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 px-6 py-2 transition-opacity hover:opacity-100"
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <Icon className="w-full h-full" />
              </div>
              <span className="text-base font-semibold text-foreground tracking-tight">
                {brand.name}
              </span>
            </div>
          );
        })}
      </Marquee>
    </section>
  );
}
