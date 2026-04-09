# katafract.com Website — Agent Instructions

## Project Purpose

katafract.com marketing site. Static HTML pages for the Katafract/Enclave product line — no build pipeline, no framework, no dependencies. Privacy-first: no external CDNs, no tracking pixels, self-hosted fonts.

## Tech Stack

- Pure HTML5, CSS3, vanilla ES6 JavaScript
- Self-hosted WOFF2 fonts: Cormorant Garamond, DM Sans, JetBrains Mono (in `fonts/`)
- CSS custom properties for design tokens
- Color palette: cyan `#00F0FF`, magenta `#FF006E`, dark navy background
- No npm, no build tools, no framework

## Site Structure

**See `STRUCTURE.md`** for the authoritative reference: product status (live/planned), App Store IDs, per-page inventory, SEO checklist, and the full content update checklist. Update STRUCTURE.md whenever a product goes live or an App Store ID changes.

## Key Pages

| File | Purpose |
|---|---|
| `index.html` | Landing page — hero, philosophy, product overview, CTA |
| `enclave.html` | Enclave product page |
| `dns.html` | Haven DNS setup guide with tabs (iPhone / Mac / Android) |
| `pricing.html` | Pricing tiers with monthly/annual toggle, Stripe integration |
| `about.html` | Company story, philosophy, app portfolio |
| `support.html` | Support page |
| `privacy.html` | Privacy policy |
| `terms.html` | Terms of service |
| `canary.html` | Warrant canary (updated monthly by bot) |

## How to Deploy

Push to `main` — GitHub Actions deploys to Cloudflare Pages (`katafract-web`) automatically in ~30s.

```bash
git add -A && git commit -m "..." && git push
```

CF Pages project: `katafract-web`. Account ID: `bab9d8a1edbf2d5f4882c4452534c860`.

## Asset Structure

```
fonts/           # WOFF2 font files (do not link external CDNs)
fonts.css        # @font-face declarations
apps/            # Sub-pages for individual apps
privacy/         # Privacy policy directory mirror
terms/           # Terms directory mirror
support/         # Support directory mirror
favicon.svg      # SVG favicon
robots.txt
sitemap.xml
```

## Constraints

- **Do NOT add a build pipeline** — file is deployed as-is
- **Do NOT refactor to React/Vue/Svelte** — static HTML is intentional
- **Do NOT link external CDNs** (Google Fonts, jsDelivr, etc.) — privacy-first philosophy
- **Do NOT add client-side routing** — each page is a standalone HTML file
- Pricing values are hardcoded in `pricing.html` — update manually when prices change
- Maintain the dark navy + cyan/magenta color scheme
- Keep font loading self-hosted via `fonts/` directory
