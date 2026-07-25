import { Leaf } from "lucide-react";

export function Footer() {
  return (
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
  );
}
