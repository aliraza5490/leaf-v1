import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureVisualProps {
  icons: LucideIcon[];
  label: string;
}

export function FeatureVisual({ icons, label }: FeatureVisualProps) {
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
