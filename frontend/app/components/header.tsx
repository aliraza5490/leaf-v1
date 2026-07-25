"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeCustomizer } from "@/components/common/theme-customizer";
import { useAuth } from "@/hooks/auth/use-auth";

export function Header() {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border/40 bg-background/80 backdrop-blur shadow-sm"
          : "border-b border-transparent bg-transparent"
      }`}
    >
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
  );
}
