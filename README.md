# Pulse

Train anywhere. Track everything. No Wi-Fi required.

A modern, offline-first Progressive Web App (PWA) for tracking workouts. Built with Next.js 15, TypeScript, and designed to work seamlessly whether you're online or offline.

## Features

- 🏋️ **Workout Tracking** – Log workouts with sets, reps, weight, duration, and notes
- 📊 **Weekly Statistics** – View workout summaries and track your consistency
- 🌙 **Dark Mode** – System-aware theme support
- 📱 **Progressive Web App** – Install on your device and use offline
- ⚡ **Offline-First** – All data persists locally with localStorage
- 🎨 **Beautiful UI** – Clean, calm design with thoughtful animations

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+ or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pulse
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

- **`npm run dev`** – Start the development server with hot reload
- **`npm run build`** – Build the production-optimized bundle
- **`npm run start`** – Serve the production build locally
- **`npm run lint`** – Run ESLint to check code quality

## Tech Stack

### Core Framework
- **[Next.js 15](https://nextjs.org/)** – React framework with App Router
- **[React 18](https://react.dev/)** – UI library with server components
- **[TypeScript](https://www.typescriptlang.org/)** – Type-safe JavaScript

### State Management
- **[Zustand](https://zustand.docs.pmnd.rs/)** – Lightweight state management with localStorage persistence

### Styling
- **[Tailwind CSS](https://tailwindcss.com/)** – Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** – Animation library
- **[Lexend](https://fonts.google.com/specimen/Lexend)** – Primary typeface via `next/font`

### PWA & Offline
- **[next-pwa](https://github.com/shadowwalker/next-pwa)** – Service worker generation and caching strategies
- **[Workbox](https://developers.google.com/web/tools/workbox)** – Runtime caching for offline support

### UI Components
- **[Radix UI](https://www.radix-ui.com/)** – Accessible, unstyled UI primitives
- **[next-themes](https://github.com/pacocoursey/next-themes)** – Theme management with dark mode

## Project Structure

```
pulse/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with theme provider
│   ├── page.tsx             # Dashboard (home page)
│   ├── add/page.tsx         # Add workout form
│   ├── workouts/page.tsx    # All workouts list
│   └── globals.css          # Global styles and CSS tokens
├── components/              # Shared React components
│   ├── Header.tsx           # Navigation header
│   ├── Layout.tsx           # Page layout wrapper
│   ├── ThemeProvider.tsx    # Theme context provider
│   ├── ThemeToggle.tsx      # Dark mode toggle
│   └── ServiceWorkerRegistration.tsx  # PWA service worker
├── lib/                     # Core business logic
│   ├── useWorkouts.ts       # Zustand store and workout hooks
│   └── workouts.ts          # Workout type definitions
├── public/                  # Static assets
│   ├── icons/               # PWA icons
│   ├── sw.js               # Generated service worker
│   └── manifest.json       # PWA manifest
├── next.config.mjs         # Next.js configuration with PWA
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Deployment

### Vercel (Recommended)

Pulse is optimized for deployment on [Vercel](https://vercel.com), the platform from the creators of Next.js.

#### Quick Deploy

1. **Push to Git** – Commit your code to GitHub, GitLab, or Bitbucket
2. **Import to Vercel** – Visit [vercel.com/new](https://vercel.com/new) and import your repository
3. **Configure** – Vercel will auto-detect Next.js settings
4. **Deploy** – Click Deploy and your app will be live in minutes

#### Manual Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod
```

### Build Output

The production build creates static pages for optimal performance:
- All routes are pre-rendered at build time
- Service worker is generated with caching strategies
- Assets are optimized and minified
- Output is fully static (can be hosted on any CDN)

### Environment Variables

No environment variables are required for basic deployment. All data is stored client-side using localStorage.

### PWA Configuration

The PWA manifest and service worker are automatically generated during build:
- **Icons**: Located in `public/icons/` (multiple sizes for different devices)
- **Manifest**: `public/manifest.json` with app metadata
- **Service Worker**: Generated as `public/sw.js` with caching strategies
- **Offline Support**: Configured for offline-first operation

### Vercel-Specific Optimizations

- **Edge Runtime**: Leverages Vercel's edge network for fast global delivery
- **Static Export**: All pages are pre-rendered for instant loading
- **Asset Optimization**: Images and fonts are automatically optimized
- **Zero Configuration**: Works out of the box with Vercel's defaults

### Custom Domains

After deployment on Vercel:
1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Development

### Code Style

- **TypeScript** – Strict mode enabled for type safety
- **ESLint** – Next.js recommended rules
- **Formatting** – Consistent code style across the project

### Key Patterns

- **Client Components** – Pages use `'use client'` for interactivity
- **Server Components** – Layout uses React Server Components
- **State Persistence** – Zustand with localStorage middleware
- **Type Safety** – All components and functions are fully typed
- **Accessibility** – Semantic HTML and ARIA labels throughout

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Android Chrome 90+

## License

See [LICENSE](LICENSE) file for details.

---

Built with ❤️ for athletes who train anywhere.
