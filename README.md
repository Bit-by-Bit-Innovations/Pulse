# Pulse

Train anywhere. Track everything. No Wi-Fi required.

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The app runs on [http://localhost:3000](http://localhost:3000) by default.

## Tech Stack

- [Next.js 15](https://nextjs.org/) with the App Router
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [Tailwind CSS](https://tailwindcss.com/) with a calm, token-driven theme
- [Lexend](https://fonts.google.com/specimen/Lexend) as the primary typeface via `next/font`

## Project Structure

- `app/` – App Router entrypoints, including the global layout and base page
- `components/` – Shared UI elements such as the header and layout shell
- `public/` – Static assets

## Available Scripts

- `npm run dev` – Start the local development server
- `npm run build` – Build the production bundle
- `npm run start` – Serve the production build
- `npm run lint` – Run ESLint using Next.js defaults

## Styling

Global styles live in `app/globals.css` and define the color tokens, Lexend font, and custom utility classes. Tailwind is configured in `tailwind.config.ts` with `darkMode: "class"` to support theme toggling in future iterations.
