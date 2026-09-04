# Context Memory — Orchestrator Generation 2

## Project Overview
- Domain: `https://offline.fedu.vn`
- Workspace: `/Users/vietmac/Documents/CODE/offline`
- Framework: React 18 + Vite + TypeScript + Tailwind CSS

## Core Priorities (from ORIGINAL_REQUEST.md)
1. Single Source of Truth (`src/content.ts`): 100% of copywriting, stats, links, media URLs centralized.
2. Pure View Components (`src/sections/*`, `src/components/*`): 0 hardcoded Vietnamese strings, no inline regex parsing.
3. Content Map (`CONTENT_MAP.md`): Detailed lookup for instant (<5s) modifications.
4. Asset Footprint: Clean 51 unreferenced dead assets (~90.72 MB) from `public/`.
5. Performance: `npm run typecheck` & `npm run build` 100% clean, main JS bundle gzip < 120 KB.
6. SEO & Metadata: Canonical, OG, Twitter tags in `index.html`, `public/robots.txt`, modern favicon.
7. Registration API: `/api/register` dual Google Sheets sync & Telegram alert.
8. Live Deployment: Connect to `https://offline.fedu.vn`, verify HTTP 200, valid SSL, live content, 100% E2E tests pass.

## Current State Summary
- M3 & M4 completed in Generation 1.
- M1 remediation patch applied by Worker M1-R2 (`.agents/worker_m1_r2_1/handoff.md`).
- M1 Gate Iteration 2 squad pending dispatch.
