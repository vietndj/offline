# BRIEFING — 2026-09-04T00:37:45Z

## Mission
Thoroughly survey SEO, API (/api/register), and Deployment for offline.fedu.vn to prepare for R3, R4, R5.

## 🔒 My Identity
- Archetype: explorer
- Roles: Teamwork explorer (read-only investigation, analysis, synthesis, handoff)
- Working directory: /Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_3
- Original parent: 3d3c0102-5dd3-48c2-a77b-5fc4bbd0d697
- Milestone: survey

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- Inspect SEO, API (/api/register), and Deployment
- Deliver findings in handoff.md and maintain progress.md

## Current Parent
- Conversation ID: 3d3c0102-5dd3-48c2-a77b-5fc4bbd0d697
- Updated: not yet

## Investigation State
- **Explored paths**:
  - `index.html`, `public/robots.txt`, `public/favicon.svg`, `public/opengraph.jpg`
  - `api/register.js`, `vite.config.ts`, `src/components/RegisterModal.tsx`, `src/sections/RegisterSection.tsx`, `src/App.tsx`, `src/pages/SuccessPage.tsx`
  - `.vercel/project.json`, `vercel.json`, `.env`, `.env.local`
  - Live production endpoints at `https://offline.fedu.vn`
- **Key findings**:
  1. Production DNS (`66.33.60.67, 76.76.21.98`), SSL (Let's Encrypt, 87 days left), and HTTP 200 all operational.
  2. SEO Metadata is missing canonical URL, OpenGraph tags (`og:title`, `og:image`, `og:url`, `og:desc`), and Twitter Cards. Favicon SVG still has "30D" badge.
  3. API `/api/register` works in dual dev/prod mode via Vite middleware & Vercel serverless. Telegram bot (`nova0410_bot`) is online.
  4. Google Sheets dual sync: Primary (`1PaHkFMd...`, tab 'Danh Sách Học Viên') & Master (`1J9Zrj...`, tab 'Offline FEDU') columns A:G match `api/register.js` exactly.
  5. Critical config gap: Production Vercel environment variable `GOOGLE_SPREADSHEET_ID` points to Master sheet (`1J9Zrj...`), meaning Primary sheet (`1PaHkFMd...`) is bypassed in live production unless env var is updated.
- **Unexplored areas**: None for survey scope. All 5 required tasks surveyed with empirical scripts.

## Key Decisions Made
- Created automated test suite `test-register-api.mjs` (OPTIONS, 400 validation, 200 GET, and safe dry-run POST).
- Created automated deployment verification script `verify-production.mjs` verifying DNS, SSL, HTTP 200, SEO tags, robots.txt, and API health.

## Artifact Index
- /Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_3/DISPATCH.md — Task instructions
- /Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_3/BRIEFING.md — Situational awareness
- /Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_3/progress.md — Progress log / heartbeat
- /Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_3/verify-production.mjs — Production deployment verification script
- /Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_3/test-register-api.mjs — /api/register automated test script
- /Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_3/handoff.md — Final comprehensive survey report
