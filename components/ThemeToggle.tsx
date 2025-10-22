"use client";

import * as Switch from "@radix-ui/react-switch";
import { Label } from "@radix-ui/react-label";
import { useTheme } from "next-themes";
import { useEffect, useId, useState } from "react";

export function ThemeToggle(): JSX.Element {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const switchId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="flex shrink-0 items-center gap-2">
      <Label htmlFor={switchId} className="sr-only">
        Theme
      </Label>
      <Switch.Root
        id={switchId}
        checked={isDark}
        onCheckedChange={(checked) => {
          if (!mounted) {
            return;
          }

          setTheme(checked ? "dark" : "light");
        }}
        className="group relative inline-flex h-9 w-16 items-center rounded-full border border-border/70 bg-surface/90 p-1 text-xs font-semibold uppercase tracking-[0.35em] text-muted shadow-subtle transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=checked]:border-accent/40 data-[state=checked]:bg-accent/15 data-[state=checked]:text-accent"
      >
        <span className="pointer-events-none absolute left-2 select-none text-[0.55rem] tracking-[0.32em] opacity-100 transition-opacity duration-200 group-data-[state=checked]:opacity-0">
          Light
        </span>
        <span className="pointer-events-none absolute right-2 select-none text-[0.55rem] tracking-[0.32em] opacity-0 transition-opacity duration-200 group-data-[state=checked]:opacity-100">
          Dark
        </span>
        <Switch.Thumb
          className="inline-flex h-7 w-7 translate-x-0 items-center justify-center rounded-full bg-foreground text-background shadow-soft transition-transform duration-200 will-change-transform data-[state=checked]:translate-x-7"
        >
          <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-background transition-colors duration-200 group-data-[state=checked]:opacity-0" />
            <span className="absolute inset-0 rounded-full border border-background/50 bg-foreground/90 transition-colors duration-200 group-data-[state=unchecked]:opacity-0" />
          </span>
        </Switch.Thumb>
      </Switch.Root>
    </div>
  );
}
