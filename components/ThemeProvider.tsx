"use client";

import type { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableColorScheme={false}
      enableSystem
      storageKey="pulse-theme"
      themes={["light", "dark"]}
    >
      {children}
    </NextThemesProvider>
  );
}
