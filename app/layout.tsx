import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import type { ReactNode } from "react";

import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";

import "./globals.css";

const lexend = Lexend({ subsets: ["latin"], variable: "--font-lexend", display: "swap" });

export const metadata: Metadata = {
  title: "Pulse Platform",
  description: "A calm foundation for building the Pulse experience platform."
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en" className={lexend.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pb-12 pt-6 sm:pb-16 sm:pt-10">
              {children}
            </main>
            <footer className="layout-shell py-8 text-xs text-muted">
              <p className="text-center md:text-left">
                Built with a focus on clarity, calmness, and momentum for emerging product teams.
              </p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
