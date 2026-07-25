"use client";

import { Palette, Check, Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useThemeColor } from "@/hooks/ui/use-theme-color";
import { accentColors, baseColors } from "@/lib/theme/colors";
import { cn } from "@/lib/utils";

export function ThemeCustomizer() {
  const { theme, setTheme } = useTheme();
  const { accentColor, baseColor, setAccentColor, setBaseColor } =
    useThemeColor();

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Customize theme">
              <Palette className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">Customize theme</TooltipContent>
      </Tooltip>

      <PopoverContent align="end" className="w-80">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Mode</span>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("light")}
                className="gap-1.5"
              >
                <Sun className="h-3.5 w-3.5" />
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("dark")}
                className="gap-1.5"
              >
                <Moon className="h-3.5 w-3.5" />
                Dark
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                size="sm"
                onClick={() => setTheme("system")}
                className="gap-1.5"
              >
                <Monitor className="h-3.5 w-3.5" />
                System
              </Button>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Accent</span>
            <div className="grid grid-cols-7 gap-2">
              {accentColors.map((color) => (
                <Tooltip key={color.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setAccentColor(color.id)}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full transition-all",
                        "hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        accentColor === color.id
                          ? "ring-2 ring-ring ring-offset-2 ring-offset-background"
                          : "ring-1 ring-border"
                      )}
                      style={{ backgroundColor: color.swatch }}
                      aria-label={color.label}
                    >
                      {accentColor === color.id && (
                        <Check className="h-4 w-4 text-white drop-shadow-sm" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{color.label}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Base</span>
            <div className="grid grid-cols-6 gap-2">
              {baseColors.map((color) => (
                <Tooltip key={color.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setBaseColor(color.id)}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full transition-all",
                        "hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        baseColor === color.id
                          ? "ring-2 ring-ring ring-offset-2 ring-offset-background"
                          : "ring-1 ring-border"
                      )}
                      style={{ backgroundColor: color.swatch }}
                      aria-label={color.label}
                    >
                      {baseColor === color.id && (
                        <Check className="h-4 w-4 text-foreground drop-shadow-sm" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{color.label}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
