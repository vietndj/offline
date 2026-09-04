# BRIEFING — 2026-09-04T07:43:20+07:00

## Mission
Configure and verify complete SEO metadata, canonical links, OpenGraph, Twitter Cards in `index.html`, modernize `public/favicon.svg` branding, and standardize `public/robots.txt` for offline.fedu.vn.

## 🔒 My Identity
- Archetype: worker
- Roles: implementer, qa, specialist
- Working directory: /Users/vietmac/Documents/CODE/offline/.agents/worker_m3_1/
- Original parent: 3d3c0102-5dd3-48c2-a77b-5fc4bbd0d697
- Milestone: M3 (SEO & Social Share Metadata)

## 🔒 Key Constraints
- Exclusive write ownership:
  - `index.html`
  - `public/robots.txt`
  - `public/favicon.svg`
  - `.agents/worker_m3_1/*`
- Strictly DO NOT modify `src/` or `api/` files.
- Integrity Mandate: Genuine implementations only; no cheating or hardcoding fake verification.
- Report completion back to parent via `send_message`.

## Current Parent
- Conversation ID: 3d3c0102-5dd3-48c2-a77b-5fc4bbd0d697
- Updated: not yet

## Task Summary
- **What to build**:
  1. SEO & OpenGraph & Twitter tags in `index.html` (canonical `https://offline.fedu.vn/`, meta title, meta description, og:*, twitter:*).
  2. Modernize `public/favicon.svg` with FEDU branding (remove legacy "30D" badge).
  3. Standardize `public/robots.txt` (`User-agent: *`, `Allow: /`, `Disallow: /api/`, `Sitemap: https://offline.fedu.vn/sitemap.xml`).
  4. Verify build (`npm run build`).
  5. Deliver `handoff.md` and notify parent.
- **Success criteria**:
  - `index.html` has canonical, title, description, og:type, og:url, og:title, og:description, og:image, og:image:width, og:image:height, og:locale, og:site_name, twitter:card, twitter:title, twitter:description, twitter:image.
  - `public/favicon.svg` updated with clean FEDU branding without outdated "30D".
  - `public/robots.txt` contains standard directives including crawler access and sitemap.
  - `npm run build` succeeds with 0 errors.
- **Interface contracts**: `/Users/vietmac/Documents/CODE/offline/PROJECT.md`
- **Code layout**: `/Users/vietmac/Documents/CODE/offline/PROJECT.md § Code Layout`

## Key Decisions Made
- Use `https://offline.fedu.vn/opengraph.jpg` as the OG/Twitter image because the file already exists (1280x720) in `public/`.
- Ensure title is "Khóa Học Offline Video Marketing 2 Ngày Tại Hà Nội | FEDU" or "Khóa Học AI Thực Chiến Offline Hà Nội & TP.HCM | FEDU AI". We will verify exact title consistency with PROJECT.md and existing index.html.
- Keep `public/robots.txt` standard with search crawler allowance and Disallow: /api/, pointing to sitemap.

## Artifact Index
- `/Users/vietmac/Documents/CODE/offline/index.html` — Updated head metadata
- `/Users/vietmac/Documents/CODE/offline/public/favicon.svg` — Standardized FEDU favicon
- `/Users/vietmac/Documents/CODE/offline/public/robots.txt` — Standardized robots rules
- `/Users/vietmac/Documents/CODE/offline/.agents/worker_m3_1/progress.md` — Liveness & progress log
- `/Users/vietmac/Documents/CODE/offline/.agents/worker_m3_1/handoff.md` — Final handoff report

## Change Tracker
- **Files modified**:
  - `index.html`: Added canonical URL, OpenGraph tags (title, description, image, url, type, locale, site_name), and Twitter Card (summary_large_image).
  - `public/favicon.svg`: Replaced legacy "30D" badge with standardized "FEDU" badge emblem.
  - `public/robots.txt`: Added `Disallow: /api/` and `Sitemap: https://offline.fedu.vn/sitemap.xml`.
- **Build status**: PASS (`npm run build` and `npm run typecheck` 0 errors).
- **Pending issues**: None. All M3 scope items completed.

## Quality Status
- **Build/test result**: PASS. `verify_m3.mjs` (42/42 assertions passed across source and dist artifacts).
- **Lint status**: 0 errors.
- **Tests added/modified**: `.agents/worker_m3_1/verify_m3.mjs` verifying canonical, meta, OG, Twitter Card, favicon, and robots rules.

## Loaded Skills
None specified in dispatch.
