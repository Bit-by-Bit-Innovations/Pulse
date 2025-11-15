# Deployment Guide

## Vercel Deployment (Recommended)

### Prerequisites
- GitHub, GitLab, or Bitbucket account
- Vercel account (free tier available)

### Steps

1. **Push to Git Repository**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Select your Git provider
   - Import the repository
   - Click "Deploy"

3. **Configure (Optional)**
   - Framework Preset: Next.js (auto-detected)
   - Build Command: `npm run build` (auto-configured)
   - Output Directory: `.next` (auto-configured)
   - Install Command: `npm install` (auto-configured)

### Environment Variables
No environment variables required. All data is stored client-side.

### Custom Domain
After deployment:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as provided

## Alternative Hosting

### Static Export to Any CDN

The app builds as static pages and can be hosted anywhere:

```bash
npm run build
```

Output is in `.next/` directory and can be served with:
```bash
npm run start
```

### Docker Deployment

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t pulse .
docker run -p 3000:3000 pulse
```

## CI/CD Setup

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - run: npm run lint
```

## Performance Checklist

- ✅ Static page generation
- ✅ Service worker for offline support
- ✅ PWA manifest for installability
- ✅ Optimized fonts with next/font
- ✅ Client-side data persistence
- ✅ Code splitting by route
- ✅ Minified production bundles

## Post-Deployment

### Verify PWA Installation
1. Visit your deployed URL
2. Open DevTools → Application
3. Check Service Worker registration
4. Test "Add to Home Screen"

### Test Offline Mode
1. Load the app
2. Open DevTools → Network
3. Set throttling to "Offline"
4. Refresh and verify functionality

### Monitor Performance
- Use Vercel Analytics (if on Vercel)
- Check Core Web Vitals
- Monitor Lighthouse scores

## Troubleshooting

### Build Fails
- Run `npm run build` locally first
- Check TypeScript errors: `npm run lint`
- Verify all dependencies: `npm install`

### Service Worker Not Registering
- Check HTTPS is enabled
- Verify `public/sw.js` exists after build
- Check browser console for errors

### Offline Mode Not Working
- Clear browser cache
- Unregister old service workers
- Rebuild and redeploy
