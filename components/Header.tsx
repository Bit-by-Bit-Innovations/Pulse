"use client";

import Link from "next/link";

import { ThemeToggle } from "@/components/ThemeToggle";

const navigation = [
  { label: "Overview", href: "#" },
  { label: "Insights", href: "#" },
  { label: "Workspace", href: "#" }
];

export function Header(): JSX.Element {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="layout-shell flex items-center justify-between gap-4 py-5">
        <Link href="/" className="flex items-center gap-3 text-foreground">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/15 text-lg font-semibold text-accent shadow-subtle">
            P
          </span>
          <span className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-muted">
              Pulse
            </span>
            <span className="text-lg font-semibold tracking-tight">Experience Platform</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="transition-colors duration-200 hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-surface/70 px-4 py-2 text-xs font-medium text-muted shadow-subtle ring-1 ring-border/40 backdrop-blur-sm sm:flex">
            <span className="h-2 w-2 rounded-full bg-accent shadow-soft" />
            <span>Live preview</span>
          </div>
          <ThemeToggle />
          <button className="inline-flex items-center justify-center rounded-full bg-surface px-4 py-2 text-sm font-semibold text-foreground shadow-subtle transition duration-200 hover:-translate-y-0.5 hover:shadow-soft">
            Get early access
          </button>
        </div>
      </div>
    </header>
  );
}
