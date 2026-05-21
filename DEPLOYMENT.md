# Canon CIO Command Center — Deployment Guide

## Overview

The Canon CIO Command Center is deployed as a static site on **Vercel**. The application is a single-page application (SPA) built with Vite and React, requiring no server-side runtime. All configuration is defined in `vercel.json` at the project root.

---

## Prerequisites

- **Node.js** 18.x or later (for local builds)
- **npm** 9.x or later
- **Vercel account** with access to the project
- **Git repository** connected to Vercel for automatic deployments

---

## Build Configuration

### Build Command

```bash
npm run build
```

This executes `vite build`, which:
1. Compiles JSX and ES2020+ JavaScript via `@vitejs/plugin-react`
2. Processes Tailwind CSS via PostCSS
3. Outputs optimized static assets to the `dist/` directory
4. Generates code-split chunks:
   - `vendor` — React and React DOM
   - `charts` — Recharts library
   - `main` — Application code

### Output Directory

```
dist/
```

Vercel serves this directory as the static site root.

### Environment Variables

**No environment variables are required for the MVP.** All configuration is defined in code (`src/config/`, `src/constants/`, `src/data/`).

For future phases, variables may be added via the Vercel dashboard under **Settings → Environment Variables**. The `.env.example` file documents planned variables:

| Variable | Description | Required |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | No (future) |
| `VITE_ENABLE_ANALYTICS` | Enable analytics tracking | No (future) |
| `VITE_FEATURE_FLAG_ADVANCED_CHARTS` | Enable advanced chart features | No (future) |

---

## Vercel Configuration (`vercel.json`)

The project includes a `vercel.json` at the root with the following configuration:

### SPA Rewrites

All routes are rewritten to `index.html` to support client-side routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Security Headers

Applied to all responses:

| Header | Value | Purpose |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Prevents MIME type sniffing |
| `X-Frame-Options` | `DENY` | Prevents clickjacking |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controls referrer information |

### Static Asset Caching

Assets in `/assets/` receive long-term caching with immutable directive:

```
Cache-Control: public, max-age=31536000, immutable
```

This is safe because Vite generates content-hashed filenames (e.g., `index-a1b2c3d4.js`). When file contents change, the filename changes, bypassing the cache.

---

## Deployment Methods

### Automatic Deployments (Recommended)

1. **Connect Git Repository** in the Vercel dashboard
2. Vercel automatically detects the framework as **Vite**
3. Build settings are read from `vercel.json`
4. Every push to the configured branch (typically `main`) triggers a production deployment
5. Every pull request triggers a **preview deployment** with a unique URL

### Manual Deployment via CLI

```bash
# Install Vercel CLI (one-time)
npm i -g vercel

# Deploy to production
vercel --prod

# Deploy to preview (staging)
vercel
```

### Deployment from Local Build

```bash
# Build locally
npm run build

# Deploy the dist directory
vercel deploy dist --prod
```

---

## Preview Deployments

Preview deployments are created automatically for:

- **Pull Requests** — Each PR gets a unique preview URL
- **Branch pushes** (if configured) — Non-production branches can trigger preview builds

Preview URLs follow the pattern:
```
https://<project-name>-<git-hash>-<scope>.vercel.app
```

Preview deployments:
- Use the same build configuration as production
- Are isolated from production
- Include a comment on the PR with the preview URL (if GitHub/GitLab integration is enabled)
- Are automatically deleted when the branch is deleted or the PR is closed

---

## Custom Domain Setup (Optional)

1. In the Vercel dashboard, navigate to **Settings → Domains**
2. Add your custom domain (e.g., `cio-command-center.canon.com`)
3. Configure DNS:
   - **Option A (Recommended):** Use Vercel nameservers for automatic SSL and CDN
   - **Option B:** Add a CNAME record pointing to `cname.vercel-dns.com`
4. Vercel automatically provisions and renews SSL certificates via Let's Encrypt
5. Update the `Referrer-Policy` header in `vercel.json` if the domain changes

---

## Rollback Procedure

### Via Vercel Dashboard

1. Navigate to **Deployments** in the Vercel dashboard
2. Find the last known-good deployment
3. Click the **"…"** menu → **Promote to Production**
4. The selected deployment becomes the live production version immediately

### Via Vercel CLI

```bash
# List recent deployments
vercel list

# Rollback to a specific deployment
vercel rollback <deployment-url-or-id>
```

### Rollback Considerations

- Rollbacks are **instant** — Vercel serves the previous build's static assets
- No database migrations or server-side state to manage (static site)
- Preview deployments are unaffected by production rollbacks
- The rolled-back deployment remains in the deployment history for future reference

---

## Cache Strategy

### Static Assets (`/assets/*`)

- **Cache duration:** 1 year (31536000 seconds)
- **Cache directive:** `public, max-age=31536000, immutable`
- **Cache key:** Content-hashed filename (e.g., `index-a1b2c3d4.js`)
- **Invalidation:** Automatic — new builds produce new hashed filenames

### HTML (`index.html`)

- **Cache duration:** No caching (`Cache-Control: no-cache` by default on Vercel)
- **Reason:** Ensures users always receive the latest `index.html` referencing the newest asset hashes

### Third-Party Fonts (Urbanist via @fontsource)

- Font files are bundled as static assets and cached with the same 1-year immutable policy
- Font CSS is inlined during the Vite build

---

## Build Troubleshooting

### Build Fails with "Out of Memory"

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Build Fails with "Module Not Found"

1. Verify all dependencies are installed: `npm ci`
2. Check for missing imports in recently modified files
3. Clear Vite cache: `rm -rf node_modules/.vite`

### Preview Deployment Differs from Local

1. Ensure local `node_modules` matches `package-lock.json`: `npm ci`
2. Build locally and compare `dist/` output: `npm run build`
3. Check for environment-specific code that may behave differently in production

---

## Monitoring

### Vercel Analytics (Optional)

Enable **Web Analytics** in the Vercel dashboard for:
- Page views and unique visitors
- Core Web Vitals (LCP, FID, CLS)
- Geographic distribution

### Custom Event Tracking

The application includes console-based event tracking (`src/utils/eventTracking.js`). In production, these events are logged to the browser console. For production analytics, integrate with a third-party service (e.g., Google Analytics, Mixpanel) by modifying the `track()` function.

---

## Security Considerations

### Headers (Already Configured)

| Header | Protection |
|---|---|
| `X-Content-Type-Options: nosniff` | MIME type sniffing attacks |
| `X-Frame-Options: DENY` | Clickjacking |
| `Referrer-Policy: strict-origin-when-cross-origin` | Referrer leakage |

### Additional Recommendations

- **Content Security Policy (CSP):** Add a CSP header in `vercel.json` to restrict script sources
- **HSTS:** Vercel automatically enables HSTS for custom domains with SSL
- **Dependency Auditing:** Run `npm audit` regularly and before each production deployment
- **Environment Variables:** Never commit `.env` files; use Vercel's encrypted environment variables for secrets

---

## Continuous Integration / Continuous Deployment (CI/CD)

### Recommended Workflow

1. **Development:** Work on feature branches
2. **Pull Request:** Create PR → Vercel creates preview deployment
3. **Review:** Test preview deployment, review code
4. **Merge:** Merge to `main` → Vercel deploys to production
5. **Monitor:** Check production deployment, verify analytics

### GitHub Actions (Optional)

For additional CI checks before Vercel deployment:

```yaml
name: CI
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm test
      - run: npm run build
```

---

## Quick Reference

| Task | Command / Location |
|---|---|
| Build locally | `npm run build` |
| Preview build locally | `npm run preview` |
| Deploy to production | `vercel --prod` |
| Deploy preview | `vercel` |
| List deployments | `vercel list` |
| Rollback | `vercel rollback <url>` |
| View logs | Vercel Dashboard → Deployments → View Logs |
| Environment variables | Vercel Dashboard → Settings → Environment Variables |
| Custom domain | Vercel Dashboard → Settings → Domains |
| Run tests | `npm test` |