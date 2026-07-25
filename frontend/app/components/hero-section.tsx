"use client";

import Link from "next/link";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Boxes } from "@/components/ui/background-boxes";
import { ChatMockup } from "./chat-mockup";

export function HeroSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative overflow-hidden -mt-16 pt-32 pb-20 px-4 sm:px-6 sm:pt-36 lg:px-8 lg:pt-40 lg:pb-28">
      <div className="absolute inset-0 w-full h-full bg-background z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--primary)/0.08,transparent_60%)] pointer-events-none z-10" />
      <div className="relative z-20 mx-auto max-w-6xl">
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
  );
}
