# Test Infrastructure Specification: offline.fedu.vn

## 1. Test Philosophy

### 1.1 Opaque-Box & Requirement-Driven Testing
The testing harness for `offline.fedu.vn` is built on an **opaque-box, requirement-driven** architecture. Rather than asserting private implementation minutiae, tests evaluate:
1. **Source of Truth Contracts**: Single Source of Truth (`src/content.ts`) exports, type definitions, and the total absence of hardcoded copy in view components.
2. **Structural & Semantic Integrity**: Content Map (`CONTENT_MAP.md`), SEO tags, OpenGraph metadata, robots.txt, and favicon.
3. **Build & Performance Thresholds**: TypeScript zero-error typecheck, production build generation, and gzipped main JavaScript bundle budget (< 120 KB).
4. **API & Data Flow Contracts**: `/api/register` CORS handling, health check, schema validation (400 on missing required fields), dual-sync configuration (Primary vs Master sheets), and resilience.
5. **Live Production Observability**: DNS resolution, valid SSL (>30 days remaining), HTTP 200 responses, and live rendering for `https://offline.fedu.vn`.

### 1.2 Authoritative Expected Output Derivation
Expected outputs are derived strictly from:
- `ORIGINAL_REQUEST.md` (R1: Fast Modification, R2: Performance & Cleanup, R3: SEO & Social Share, R4: Registration Flow, R5: Production Deployment).
- `PROJECT.md` (F1 to F12 Feature Inventory and Interface Contracts).
- Official standards: W3C HTML5, OpenGraph Protocol, Twitter Cards, RFC 9110 (HTTP), RFC 8446 (TLS 1.3).

### 1.3 Progressive Testability & Non-Destructive Operation
- **Progressive Testability**: Tests isolate features so that completed milestones pass immediately, while in-progress features report clear diagnostic messages without breaking the entire suite.
- **Safety**: Automated test runs default to dry-run verification for external API dispatch to prevent spamming live student management sheets or Telegram bot channels. Live submission can be explicitly triggered using `EXECUTE_REAL_SUBMISSION=true`.

---

## 2. Feature Inventory Mapping (F1 - F12 Across Tiers 1 - 4)

| Feature ID | Feature Name | Tier 1: Feature Coverage | Tier 2: Boundary & Corner Cases | Tier 3: Cross-Feature Combinations | Tier 4: Real-World User Journeys |
|---|---|---|---|---|---|
| **F1** | Centralize 100% Copywriting into `src/content.ts` | F1.1 - F1.5 (5 tests) | B3.5 (multiline copy), B4.4 (emojis) | C1 (F1 + F6), C2 (F1 + F3) | S3 (Fast Edit Workflow) |
| **F2** | Pure View Components Refactoring | F2.1 - F2.5 (5 tests) | B3.4 (boundary lengths) | C1 (F1 + F6), C4 (F9 + F10) | S1, S2 (Rendering in views) |
| **F3** | Content Map Documentation (`CONTENT_MAP.md`) | F3.1 - F3.5 (5 tests) | B3.1 (long key paths) | C2 (F1 + F3) | S3 (Content Editor Navigation) |
| **F4** | Quick Edit Verification Test | F4.1 - F4.5 (5 tests) | B4.1 (Vietnamese diacritics) | C1 (F1 + F6) | S3 (Instant UI Reflection) |
| **F5** | Dead & Unused Asset Pruning | F5.1 - F5.5 (5 tests) | B3.3 (large file limits) | C5 (F5 + F6) | S1 (Fast Media Loading) |
| **F6** | Bundle Optimization & Build Validation | F6.1 - F6.5 (5 tests) | B3.3 (extreme bundle limits) | C1 (F1 + F6), C5 (F5 + F6) | S1 (Speed / TTFB) |
| **F7** | SEO & Social Share Metadata | F7.1 - F7.5 (5 tests) | B4.2 (XSS in tags), B4.4 (emojis) | C3 (F7 + F12) | S4 (Crawler & Social Share) |
| **F8** | Favicon & Robots.txt Standardization | F8.1 - F8.5 (5 tests) | B5.5 (crawler headers) | C6 (F8 + F11) | S4 (Bot Disallow / Allow) |
| **F9** | Registration API Dual Sync & Telegram Test | F9.1 - F9.5 (5 tests) | B1.1 - B1.5, B2.1 - B2.5 | C4 (F9 + F10) | S1, S2 (Submission Flow) |
| **F10** | Form Fallback & Network Error Handling | F10.1 - F10.5 (5 tests)| B1.1 - B1.5, B5.1 - B5.5 | C4 (F9 + F10) | S1, S2 (Inline Error Recovery) |
| **F11** | Production Deployment | F11.1 - F11.5 (5 tests)| B3.3 (timeout limits) | C6 (F8 + F11) | S1, S4 (Production Domain) |
| **F12** | Automated Live Domain Verification Script | F12.1 - F12.5 (5 tests)| B2.5 (network jitter) | C3 (F7 + F12) | S1, S4 (Verification Audit) |

---

## 3. Test Tier Specifications

### Tier 1: Feature Coverage (60 Test Cases)
- **F1 (5 tests)**: `content.ts` presence & export, 14 section schemas, structured metadata, view component imports, absence of hardcoded course copy in view sections.
- **F2 (5 tests)**: 14 sections presence, 4 core components presence, SuccessPage presence, view purity, root App.tsx integration.
- **F3 (5 tests)**: `CONTENT_MAP.md` presence, markdown table structure, text editing guide, media editing guide, full section coverage.
- **F4 (5 tests)**: Title override reactivity, CTA label override, footer contact override, FAQ array mutation safety, TypeScript type enforcement.
- **F5 (5 tests)**: Zero >10MB unused video assets, zero `.DS_Store` / temporary artifacts, 100% referenced content images exist, lean GIF folder, total public footprint < 50MB.
- **F6 (5 tests)**: TypeScript `typecheck` 0 errors, Vite production build success, main JS bundle gzipped < 120 KB, CSS bundle generation, iframe/media lazy-loading attributes.
- **F7 (5 tests)**: SEO title with FEDU brand, meta description (50-250 chars), canonical URL `https://offline.fedu.vn/`, complete OpenGraph metadata, complete Twitter Card metadata.
- **F8 (5 tests)**: `robots.txt` Allow rule, `robots.txt` Disallow `/api/`, `robots.txt` Sitemap declaration, `favicon.svg` without legacy "30D" badge, `index.html` favicon link.
- **F9 (5 tests)**: `/api/register` handler export, GET health check (200), OPTIONS preflight CORS (200), Primary vs Master sheet ID segregation, valid payload acceptance.
- **F10 (5 tests)**: 400 Bad Request on missing `phone`, 400 Bad Request on missing `fullName`, 400 on empty payload, frontend modal loading state, frontend inline error handling.
- **F11 (5 tests)**: HTTPS connectivity for `https://offline.fedu.vn`, UTF-8 Content-Type, valid TLS/SSL certificate, Vercel project linkage, SPA routing rewrite.
- **F12 (5 tests)**: Automated verification script execution, DNS resolution, SSL expiration > 30 days, live HTML metadata check, live API health status.

### Tier 2: Boundary & Corner Cases (25 Test Cases)
- **Domain 1: Empty & Blank Inputs (5 tests)**:
  - Empty string `fullName: ""` rejected with 400.
  - Whitespace-only `fullName: "   "` rejected with 400.
  - Empty string `phone: ""` rejected with 400.
  - Whitespace-only `phone: "   "` rejected with 400.
  - Empty body `{}` rejected with 400.
- **Domain 2: Phone Format Extremes (5 tests)**:
  - International format `+84912345678` accepted.
  - Standard domestic 10-digit format `0987654321` accepted.
  - Spaced phone format `098 765 4321` accepted.
  - Hyphenated format `098-765-4321` accepted.
  - Non-numeric string `abcdefgh` rejected with 400.
- **Domain 3: String Length & Extreme Payload Sizes (5 tests)**:
  - Long name (500+ characters) handled gracefully without server crash.
  - Long reason/notes (2,000+ characters) handled cleanly.
  - Oversized JSON body handled without unhandled exception.
  - Single-character name accepted if non-empty.
  - Multiline text (`\n`, `\r\n`) in content fields preserved accurately.
- **Domain 4: Adversarial & Special Characters (5 tests)**:
  - Vietnamese Unicode diacritics (`Nguyễn Văn Đạt`) preserved without mojibake.
  - HTML tags (`<script>alert(1)</script>`) escaped/sanitized in notifications.
  - SQL injection patterns (`' OR 1=1 --`) handled safely.
  - Emojis (`🔥🚀`) preserved across JSON and content strings.
  - JSON meta-characters inside string values handled without parse errors.
- **Domain 5: Optional Fields & Protocol Edge Cases (5 tests)**:
  - Submission without `email` succeeds.
  - Submission without `occupation` succeeds.
  - Submission without `reason` succeeds.
  - Submission without `source` defaults gracefully.
  - OPTIONS preflight with arbitrary CORS headers returns 200.

### Tier 3: Cross-Feature Combinations (6 Pairwise Tests)
- **C1 (F1 + F6)**: Centralized Content + Bundle Budget: Changing/populating all copy in `src/content.ts` preserves main JS gzip bundle < 120 KB.
- **C2 (F1 + F3)**: Centralized Content + Content Map: Every section exported in `src/content.ts` is explicitly mapped in `CONTENT_MAP.md`.
- **C3 (F7 + F12)**: SEO Tags + Production Rendering: All SEO meta tags defined in `index.html` are accurately served and verifiable on `https://offline.fedu.vn`.
- **C4 (F9 + F10)**: API Contract + Form Error Handling: Client form error presentation exactly matches `/api/register` error payload structure.
- **C5 (F5 + F6)**: Asset Pruning + Build Distribution: Pruning unused assets ensures `dist/` contains only referenced media.
- **C6 (F8 + F11)**: Robots/Favicon + Production Hosting: Standardized `robots.txt` and `favicon.svg` serve HTTP 200 with appropriate caching on production domain.

### Tier 4: Real-World Application Scenarios (4 User Journeys)
- **S1 (Full Registration Journey)**: Landing page visit -> Hero review -> CTA click -> Modal pop-up -> Valid form submission -> Redirection to `/success?name=...&phone=...`.
- **S2 (Inline Form Error & Correction Journey)**: User visits page -> scrolls to bottom `RegisterSection` -> submits empty phone -> observes inline error -> enters valid phone -> successfully submits.
- **S3 (Fast Modification Journey)**: Content manager opens `CONTENT_MAP.md`, identifies key in `src/content.ts`, changes headline, builds application with 0 component modifications, and verifies updated output.
- **S4 (Social Share & Search Bot Journey)**: Social platform crawler fetches `https://offline.fedu.vn`, extracts valid OpenGraph 1280x720 banner and title; Googlebot reads `robots.txt`, identifies `Allow: /`, `Disallow: /api/`, and sitemap.

---

## 4. Test Runner Command & Architecture

### 4.1 Test Runner Command
```bash
# Run entire E2E test suite (Tiers 1 - 4)
node tests/e2e/runner.mjs

# Run via npm script
npm run test:e2e

# Run specific tier only
node tests/e2e/runner.mjs --tier=1
node tests/e2e/runner.mjs --tier=2
node tests/e2e/runner.mjs --tier=3
node tests/e2e/runner.mjs --tier=4

# Run with live external API submission (Warning: alerts Telegram bot & appends to Google Sheets)
EXECUTE_REAL_SUBMISSION=true node tests/e2e/runner.mjs
```

### 4.2 Architecture
- **Language & Runtime**: Node.js ESM (`node:test`, `node:assert`, `fetch`, `node:fs`, `node:path`, `node:child_process`).
- **Zero External Test Dependencies**: Fast, deterministic, runnable anywhere without installing Playwright/Cypress/Jest binaries.
- **Strict Exit Code Policy**:
  - `0`: All tests passed.
  - `1`: One or more test assertions failed.
- **Structured Console Output**: Tier-by-tier execution logs, individual assertion indicators (`✅ PASS`, `❌ FAIL`), execution duration, and tabular summary matrix.
