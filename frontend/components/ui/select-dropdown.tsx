"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface SelectDropdownOption {
  value: string;
  label: string;
}

interface SelectDropdownProps {
  /** Current selected value */
  value: string;
  /** Callback when value changes */
  onValueChange: (value: string) => void;
  /** List of options */
  options: SelectDropdownOption[];
  /** Placeholder when no value is selected */
  placeholder?: string;
  /** Optional label shown at top of the dropdown */
  label?: string;
  /** Optional icon rendered before the label */
  icon?: React.ReactNode;
  /** Alignment of the dropdown content */
  align?: "start" | "center" | "end";
  /** Additional className for the trigger button */
  className?: string;
  /** Button variant */
  variant?: "outline" | "ghost" | "secondary";
  /** Button size */
  size?: "default" | "sm" | "lg" | "icon";
  /** Disabled state */
  disabled?: boolean;
}

export function SelectDropdown({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  label,
  icon,
  align = "end",
  className,
  variant = "outline",
  size = "sm",
  disabled = false,
}: SelectDropdownProps) {
  const selectedOption = options.find((o) => o.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={disabled}
          className={cn("gap-1.5", className)}
        >
          {icon}
          <span className="truncate">
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {label && (
          <>
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
