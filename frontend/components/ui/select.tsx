"use client"

import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"
import { cn } from "@/lib/utils"

const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (val: any) => void;
  items: Map<string, React.ReactNode>;
  registerItem: (val: string, label: React.ReactNode) => () => void;
} | null>(null);

function Select({
  value,
  onValueChange,
  defaultValue,
  children,
  open,
  onOpenChange,
  disabled,
}: {
  value?: string;
  onValueChange?: (val: any) => void;
  defaultValue?: string;
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}) {
  const [localValue, setLocalValue] = React.useState(defaultValue || "");
  const activeValue = value !== undefined ? value : localValue;
  
  const activeOnValueChange = React.useCallback((val: any) => {
    if (onValueChange) {
      onValueChange(val);
    }
    setLocalValue(val);
  }, [onValueChange]);

  const [items] = React.useState(() => new Map<string, React.ReactNode>());
  const [, forceUpdate] = React.useState({});

  const registerItem = React.useCallback((val: string, label: React.ReactNode) => {
    const existing = items.get(val);
    if (existing !== label) {
      items.set(val, label);
      forceUpdate({});
    }
    return () => {
      items.delete(val);
      forceUpdate({});
    };
  }, [items]);

  React.useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value);
    }
  }, [value]);

  const contextValue = React.useMemo(() => ({
    value: activeValue,
    onValueChange: activeOnValueChange,
    items,
    registerItem
  }), [activeValue, activeOnValueChange, items, registerItem]);

  return (
    <SelectContext.Provider value={contextValue}>
      <DropdownMenuPrimitive.Root open={open} onOpenChange={onOpenChange} modal={false}>
        {children}
      </DropdownMenuPrimitive.Root>
    </SelectContext.Provider>
  )
}

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger> & {
    className?: string;
  }
>(({ className, children, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.Trigger asChild>
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 text-foreground [&>span]:line-clamp-1 gap-2 text-left",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
      </button>
    </DropdownMenuPrimitive.Trigger>
  )
})
SelectTrigger.displayName = "SelectTrigger"

function SelectValue({
  placeholder,
  className,
}: {
  placeholder?: string;
  className?: string;
}) {
  const context = React.useContext(SelectContext);
  if (!context) return null;

  const display = context.value ? context.items.get(context.value) : undefined;

  return (
    <span className={cn("truncate block", className)}>
      {display !== undefined ? display : placeholder}
    </span>
  );
}

function SelectContent({
  children,
  className,
  align = "start",
  side = "bottom",
  sideOffset = 4,
  ...props
}: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>) {
  const context = React.useContext(SelectContext);
  if (!context) return null;

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      >
        <DropdownMenuPrimitive.RadioGroup value={context.value} onValueChange={context.onValueChange}>
          {children}
        </DropdownMenuPrimitive.RadioGroup>
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  )
}

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem> & {
    value: string;
    children: React.ReactNode;
  }
>(({ value, children, className, ...props }, ref) => {
  const context = React.useContext(SelectContext);
  if (!context) return null;
  const { registerItem } = context;

  React.useEffect(() => {
    return registerItem(value, children);
  }, [value, children, registerItem]);

  return (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      value={value}
      className={cn(
        "relative flex w-full cursor-default items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
})
SelectItem.displayName = "SelectItem"

// Dummy components to prevent import errors in other files
const SelectGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => <div ref={ref} {...props}>{children}</div>
)
SelectGroup.displayName = "SelectGroup"

const SelectLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => <div ref={ref} {...props}>{children}</div>
)
SelectLabel.displayName = "SelectLabel"

const SelectSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <div ref={ref} {...props} />
)
SelectSeparator.displayName = "SelectSeparator"

function SelectScrollUpButton() { return null }
function SelectScrollDownButton() { return null }

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
