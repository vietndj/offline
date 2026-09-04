# Project: offline.fedu.vn Optimization

## Architecture
- **Single Source of Truth Architecture**: All copywriting, headlines, stats, video links, images, FAQs, and labels reside exclusively in `src/content.ts`.
- **View Layer**: Components in `src/sections/`, `src/components/`, `src/pages/`, and `src/App.tsx` are pure view components receiving data from `content.ts`. No hardcoded copy or raw links.
- **Documentation & Map**: `CONTENT_MAP.md` provides visual and code-level mapping between UI sections and `content.ts` keys for instant (<5s) modifications.
- **Performance & Asset Layer**: Cleaned `public/` directory (pruned 90+ MB unreferenced dead assets), optimized bundle splitting with main JS gzip < 120 KB, 100% passing TypeScript and Vite build.
- **SEO & Head Layer**: Fully standardized `index.html` with canonical URL `https://offline.fedu.vn`, OpenGraph metadata, Twitter Card, verified `public/robots.txt` and favicon.
- **API & Registration Layer**: `/api/register.ts` serverless handler handling form registration, dual Google Sheets sync, Telegram notification, and resilient error fallback.
- **Production & Deployment Layer**: Vercel deployment connected to `https://offline.fedu.vn` with automated verification (HTTP 200, SSL, live content rendering).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Centralize 100% Copywriting into `src/content.ts` | Eliminate hardcoded text, stats, video links, images, FAQs across all 14 sections, 4 components, 1 page (`SuccessPage`), and `App.tsx`. | M1 | Survey (Explorer 1) & ORIGINAL_REQUEST R1 |
| F2 | Pure View Components Refactoring | Refactor all UI components in `src/sections/` and `src/components/` to read strictly from `content.ts`. | M1 | Survey (Explorer 1) & ORIGINAL_REQUEST R1 |
| F3 | Content Map Documentation (`CONTENT_MAP.md`) | Create comprehensive mapping guide showing UI section, visual elements, corresponding keys in `content.ts`, and line references. | M1 | Survey (Explorer 1) & ORIGINAL_REQUEST R1 |
| F4 | Quick Edit Verification Test | Perform live test modifying a field in `content.ts` and confirming immediate UI reflection with 0 component changes. | M1 | ORIGINAL_REQUEST Acceptance Criteria R1 |
| F5 | Dead & Unused Asset Pruning | Remove 51 unreferenced assets (~90.72 MB) in `public/` (dead GIFs, unused videos, duplicate PNGs). | M2 | Survey (Explorer 2) & ORIGINAL_REQUEST R2 |
| F6 | Bundle Optimization & Build Validation | Ensure main JS bundle after gzip is < 120KB, lazy load heavy media/videos, verify `npm run typecheck` and `npm run build` pass with 0 errors/warnings. | M2 | Survey (Explorer 2) & ORIGINAL_REQUEST R2 |
| F7 | SEO & Social Share Metadata | Add meta title, description, canonical link `https://offline.fedu.vn`, OpenGraph tags (og:title, og:description, og:image, og:url), and Twitter Card in `index.html`. | M3 | Survey (Explorer 3) & ORIGINAL_REQUEST R3 |
| F8 | Favicon & Robots.txt Standardization | Update/verify favicon and ensure `public/robots.txt` correctly allows search engine indexing for `https://offline.fedu.vn`. | M3 | Survey (Explorer 3) & ORIGINAL_REQUEST R3 |
| F9 | Registration API Dual Sync & Telegram Test | Test `/api/register` with valid payload, verify Google Sheets sync (Primary and Master sheets) and Telegram bot alert, confirming `{ success: true }`. | M4 | Survey (Explorer 3) & ORIGINAL_REQUEST R4 |
| F10 | Form Fallback & Network Error Handling | Ensure client registration form gracefully handles network failures, timeouts, and user feedback. | M4 | Survey (Explorer 3) & ORIGINAL_REQUEST R4 |
| F11 | Production Deployment | Deploy the optimized application to production for domain `https://offline.fedu.vn`. | M5 | ORIGINAL_REQUEST R5 |
| F12 | Automated Live Domain Verification Script | Run automated verification script confirming HTTP 200, valid SSL, and live rendering of latest content on `https://offline.fedu.vn`. | M5 | Survey (Explorer 3) & ORIGINAL_REQUEST R5 |
| F13 | Opaque-box E2E Test Suite (Tiers 1-4) | Comprehensive requirement-driven E2E test suite with runner and test cases covering all 12 functional features, publishing `TEST_READY.md`. | E2E-Track | ORIGINAL_REQUEST & Dual Track Architecture |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| E2E | E2E Testing Track | Requirement-driven test harness, Tiers 1-4 test suite, publishes `TEST_READY.md` | none | DONE |
| M1 | Fast Modification Architecture | Centralize 100% content into `src/content.ts`, refactor view components, generate `CONTENT_MAP.md`, quick-edit test (F1, F2, F3, F4) | none | DONE |
| M2 | Performance Optimization & Source Cleanup | Prune 90+ MB unreferenced assets, optimize bundle (<120KB gzip), verify 0 typecheck/build errors (F5, F6) | none | DONE |
| M3 | SEO & Social Share Metadata | Configure meta tags, canonical, OpenGraph, Twitter Card in `index.html`, standardize favicon & `robots.txt` (F7, F8) | none | DONE |
| M4 | Registration Flow & API Testing | Test `/api/register` endpoint, verify Google Sheets & Telegram integration, ensure client error fallbacks (F9, F10) | none | DONE |
| M5 | Production Deployment, Online Verification & Final E2E | Deploy to `https://offline.fedu.vn`, verify HTTP 200, SSL, live content, and pass 100% E2E test suite (F11, F12, F13) | M1, M2, M3, M4, E2E | DONE |

## Interface Contracts
### `src/content.ts` ↔ View Components (`src/sections/*`, `src/components/*`)
- Export: `export const CONTENT: ContentData = { ... }`
- Types: Defined in `src/content.ts` or `src/types/content.ts`
- Contract: View components must NOT define any hardcoded copy, string literals for user-facing text, or hardcoded media URLs. All text/media must be accessed via `CONTENT.<section>.<field>`.

### Client Form (`src/components/RegisterModal.tsx`, `src/sections/RegisterSection.tsx`) ↔ `/api/register.ts`
- Method: `POST /api/register`
- Payload: `{ name: string, phone: string, email?: string, note?: string, source?: string, timestamp?: string }`
- Response: `{ success: true, message?: string }` or `{ success: false, error: string }`

### Automated Verification Script (`verify-production.mjs`) ↔ Live Production
- Target: `https://offline.fedu.vn`
- Checks:
  1. DNS resolution
  2. TLS/SSL certificate validation (issuer, expiration > 30 days)
  3. HTTP Status code 200
  4. Response headers (Content-Type, Security headers)
  5. HTML body verification: Meta tags (OG, Twitter, Canonical)
  6. Live Content verification: Key content strings from `src/content.ts`

## Code Layout
```
offline/
├── public/
│   ├── favicon.svg          # Modernized favicon (M3)
│   ├── robots.txt           # SEO robots crawling rules (M3)
│   ├── opengraph.jpg        # OpenGraph share banner (M3)
│   └── ...                  # Cleaned media assets only (M2)
├── src/
│   ├── content.ts           # Central Single Source of Truth (M1)
│   ├── App.tsx              # Root component consuming CONTENT (M1)
│   ├── sections/            # Pure view components (M1)
│   ├── components/          # Reusable view components & RegisterModal (M1, M4)
│   └── pages/               # SuccessPage (M1)
├── api/
│   └── register.ts          # Serverless registration API handler (M4)
├── index.html               # Standardized SEO metadata & head tags (M3)
├── CONTENT_MAP.md           # Visual & key mapping guide (M1)
├── tests/
│   └── e2e/                 # E2E Test Suite (E2E Track)
└── .agents/                 # Agent metadata only
```
