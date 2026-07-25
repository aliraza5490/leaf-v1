"use client";

import { useState } from "react";
import { CheckCircle2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function BetaSection() {
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
