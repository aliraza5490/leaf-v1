import { CheckCircle2, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FeatureVisual } from "./feature-visual";

export interface FeatureItem {
  label: string;
  title: string;
  description: string;
  bullets: string[];
  icons: LucideIcon[];
}

interface FeatureSectionProps {
  feature: FeatureItem;
  reverse: boolean;
}

export function FeatureSection({ feature, reverse }: FeatureSectionProps) {
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
          <p className="mt-4 text-base sm:text-lg text-foreground/80 leading-relaxed font-normal">
            {feature.description}
          </p>
          <ul className="mt-6 space-y-3.5">
            {feature.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm sm:text-base font-medium text-foreground/90 leading-snug">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
