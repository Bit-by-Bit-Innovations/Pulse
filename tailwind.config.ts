import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        muted: {
          DEFAULT: "rgb(var(--color-muted) / <alpha-value>)",
          foreground: "rgb(var(--color-muted-foreground) / <alpha-value>)"
        },
        accent: "rgb(var(--color-accent) / <alpha-value>)"
      },
      boxShadow: {
        soft: "0 18px 45px -25px rgba(15, 23, 42, 0.4)",
        subtle: "0 12px 35px -28px rgba(15, 23, 42, 0.35)"
      },
      borderRadius: {
        "3xl": "1.5rem"
      },
      fontFamily: {
        sans: ["var(--font-lexend)", ...defaultTheme.fontFamily.sans]
      }
    }
  },
  plugins: []
};

export default config;
