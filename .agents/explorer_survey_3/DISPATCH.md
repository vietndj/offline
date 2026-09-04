# Dispatch for Explorer Survey 3: SEO, API (/api/register) & Deployment

## Objective
Investigate SEO metadata, the registration flow API, and the deployment setup for offline.fedu.vn to prepare for R3, R4, and R5.

## Scope
- Read `/Users/vietmac/Documents/CODE/offline/.agents/ORIGINAL_REQUEST.md`
- Inspect `index.html`, `public/`, SEO meta tags, OpenGraph, Twitter Card, favicon, canonical URL, and `robots.txt`
- Inspect API routes / backend code for `/api/register` (e.g. `api/register.ts`, serverless functions, proxy, Google Sheets integration, Telegram bot notification)
- Check how form submission is handled in frontend (forms, states, error handling, fallbacks)
- Inspect deployment configuration (e.g. `vercel.json`, GitHub Actions, Netlify, Cloudflare, build scripts, environment variables) for `https://offline.fedu.vn`
- Propose test plan for `/api/register` with Sheets & Telegram
- Propose automated verification script for production deployment (HTTP 200, SSL, live content check)

## Output
Write your comprehensive analysis and handoff report to:
`/Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_3/handoff.md`
And update `/Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_3/progress.md`

## 2026-09-04T00:37:23Z
You are Explorer 3 for the offline.fedu.vn optimization project.
Your working directory is: /Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_3/
You MUST read:
- /Users/vietmac/Documents/CODE/offline/.agents/ORIGINAL_REQUEST.md
- /Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_3/DISPATCH.md

Your task is to thoroughly survey SEO, API (/api/register), and Deployment:
1. Inspect `index.html`, `public/`, SEO meta tags, OpenGraph, Twitter Card, favicon, canonical URL, and `public/robots.txt`.
2. Inspect the `/api/register` implementation (backend/serverless functions, Google Sheets integration, Telegram notification, error handling, client form submission).
3. Inspect production deployment setup (e.g. Vercel, DNS, domains, scripts) for `https://offline.fedu.vn`.
4. Propose testing strategy for `/api/register` with valid test payload.
5. Propose automated verification script for production deployment (HTTP 200, SSL, live content verification).
6. Maintain your `progress.md` with timestamps.
7. Write your comprehensive report to `/Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_3/handoff.md`.
8. Once finished, send a message to parent informing completion.

