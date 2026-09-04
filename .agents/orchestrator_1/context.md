# Context: offline.fedu.vn

## Environment
- Project Root: `/Users/vietmac/Documents/CODE/offline`
- Target Production Domain: `https://offline.fedu.vn`
- Working Directory: `/Users/vietmac/Documents/CODE/offline/.agents/orchestrator_1`
- Original Request: `/Users/vietmac/Documents/CODE/offline/.agents/ORIGINAL_REQUEST.md`

## Key Specifications & Scope
- R1: Single source of truth in `src/content.ts`, pure view components in `src/sections/`, `CONTENT_MAP.md`, quick-edit test.
- R2: Clean unused assets, optimize JS bundle < 120KB gzipped, typecheck and build 0 errors.
- R3: SEO tags, OG, Twitter Card, Favicon, canonical, `public/robots.txt`.
- R4: Registration flow `/api/register` test, Sheets & Telegram sync, fallback.
- R5: Deploy to https://offline.fedu.vn, automated verification script (HTTP 200, SSL, live content).
