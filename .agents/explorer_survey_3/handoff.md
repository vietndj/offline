# Handoff Report: Explorer Survey 3 (SEO, API /api/register & Production Deployment)

## Executive Summary
This report delivers an empirical survey of SEO metadata, the `/api/register` backend and frontend integration, and the production deployment setup for `https://offline.fedu.vn` (addressing requirements R3, R4, and R5). Automated verification and testing scripts have been developed and executed. A critical environment variable mismatch on Vercel production was uncovered that currently prevents dual-sync into the Primary Google Sheet ("Sổ Con"). Complete actionable remediations, test plans, and verification commands are documented below.

---

## 1. Observation

### 1.1 SEO, Metadata & Static Assets (`index.html`, `public/`)
* **File `index.html` (Lines 1-61):**
  - `<title>` is currently `Khóa Học Offline Video Marketing 2 Ngày Tại Hà Nội` (Line 6). It lacks brand identity (e.g., `| FEDU`).
  - `<meta name="description">` exists (Line 7): `"Khóa học offline 2 ngày tại Hà Nội do thầy Nguyễn Đức Việt trực tiếp hướng dẫn: Viết kịch bản chuyển đổi, setup 2 góc quay điện thoại, edit video chuyên nghiệp và ứng dụng AI tự động hóa."` (186 chars).
  - `<link rel="canonical">`: **MISSING** entirely.
  - **OpenGraph Tags:** **MISSING** entirely (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`, `og:site_name`).
  - **Twitter Card Tags:** **MISSING** entirely (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`).
  - `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />` is linked (Line 9).
* **Asset `public/opengraph.jpg`:**
  - File exists (`81,793` bytes). Command `file public/opengraph.jpg` confirms: `JPEG image data, JFIF standard 1.01, 1280x720`. It is 100% ready to serve as the OG and Twitter Card banner.
* **Asset `public/favicon.svg`:**
  - File exists (`2,649` bytes). Line 50 contains: `<text ...>30D</text>`. This "30D" badge was inherited from the previous "30 ngày viral" course and does not match the 2-day offline format.
* **File `public/robots.txt`:**
  - Contains only:
    ```txt
    User-agent: *
    Allow: /
    ```
  - Lacks `Disallow: /api/` and lacks `Sitemap: https://offline.fedu.vn/sitemap.xml`.
  - `public/sitemap.xml` does not exist.

### 1.2 Registration API (`/api/register`) Implementation
* **Backend File `api/register.js` (Lines 1-192):**
  - Exported as standard ESM serverless function (`export default async function handler(req, res)`).
  - **CORS Handling (Lines 134-138):**
    Sets `Access-Control-Allow-Origin: *`, `Access-Control-Allow-Methods: GET, POST, OPTIONS`. Responds 200 OK to `OPTIONS`.
  - **Health Check GET (Lines 142-148):**
    Returns JSON `{ status: 'healthy', service: 'offline.fedu.vn registration API', sheet: '...' }`.
  - **POST Validation (Lines 160-162):**
    Checks `!fullName || !phone`. Returns HTTP 400 `{ success: false, error: 'Thiếu họ tên hoặc số điện thoại' }`.
  - **Google Sheets Dual Sync (Lines 39-94):**
    - Sổ Con (Primary): ID `1PaHkFMdY615FasQDcqqeia94L1662YKES7cPuFIpKhg`, Sheet Name `"Danh Sách Học Viên"`.
    - Sổ Mẹ (Master Backup): ID `1J9ZrjLxTba9R-wuet1n_J_hKcL0PVtQDD_ag65Ewx04`, Sheet Name `"Offline FEDU"`.
    - Columns: `[submittedAt, fullName, phone, email, occupation, reason, source]`. Appends to range `'SheetName'!A:G`.
  - **Telegram Bot Dispatcher (Lines 96-131):**
    - Bot Token: `8964853536:AAHuRNm_hY-YQtveBD1HlmthN4I5xpVzM8U`.
    - Chat ID: `2050406425`.
    - Formats HTML notification with call/Zalo links, occupation, reason, time, and link to Sổ Con.
  - **Resilience (Line 177):**
    Uses `await Promise.allSettled([sheetsPromise, telegramPromise]);`. Client response does not fail if an external notification is delayed.
* **Local Development Parity (`vite.config.ts` Lines 6-59):**
  - Implements `apiRegisterPlugin()` that intercepts `/api/register` on port 4001 and executes `api/register.js` in Node, providing complete dev-to-prod environment parity without external mock servers.
* **Frontend Form Submissions:**
  - `src/components/RegisterModal.tsx` (Lines 31-59) & `src/sections/RegisterSection.tsx` (Lines 24-53):
    - Both send POST to `/api/register` with JSON body.
    - Both manage `isSubmitting` with loading spinner and disabled state.
    - Both redirect to `/success?name=...&phone=...` upon success.
    - Both display inline error messages upon API rejection or network error.

### 1.3 Production Deployment Setup (`https://offline.fedu.vn`)
* **Vercel Project Configuration:**
  - Vercel CLI version: `54.20.0 (Node.js 26.3.0)`. User: `vietndj-4576`.
  - Organization / Team: `viet-s-projects1`. Project ID: `prj_nVAQQWNFPrJLRoi5eCmw4J5Z8XcO` (`.vercel/project.json`).
  - Active Aliases:
    - `https://offline.fedu.vn`
    - `https://offline-eta.vercel.app`
    - `https://offline-viet-s-projects1.vercel.app`
  - Current live deployment: `https://offline-a6kuo1q51-viet-s-projects1.vercel.app` (Status: Ready).
* **Live Network Inspection:**
  - DNS: `dig +short offline.fedu.vn` resolves to `66.33.60.67` and `76.76.21.98` (`cname.vercel-dns.com`).
  - SSL Certificate: Issued by `Let's Encrypt (YR1)` for `offline.fedu.vn`. Valid from Sep 1, 2026 to Nov 30, 2026 (87 days remaining).
  - HTTP Status: `curl -ILs https://offline.fedu.vn` returns `HTTP/2 200`. TTFB is ~0.168s.
  - SPA Routing: `curl -s -o /dev/null -w "%{http_code}" https://offline.fedu.vn/success` returns `200` due to `vercel.json` rewrite (`/(.*) -> /index.html`).
  - Static Assets on live: `favicon.svg`, `opengraph.jpg`, `robots.txt` all return HTTP 200.

### 1.4 Critical Configuration Mismatch (Vercel Production Env vs Code)
* Live test `curl -s https://offline.fedu.vn/api/register` returned:
  ```json
  {"status":"healthy","service":"offline.fedu.vn registration API","sheet":"https://docs.google.com/spreadsheets/d/1J9ZrjLxTba9R-wuet1n_J_hKcL0PVtQDD_ag65Ewx04/edit"}
  ```
* In `api/register.js` line 46:
  `const primarySheetId = process.env.GOOGLE_SPREADSHEET_ID || DEFAULT_PRIMARY_SPREADSHEET_ID;`
* In `api/register.js` line 79:
  `if (masterSheetId && masterSheetId !== primarySheetId) { ... }`
* **Finding:** Vercel Production currently has `GOOGLE_SPREADSHEET_ID` set to `1J9Zrj...` (Master Sheet). Because `primarySheetId` is `1J9Zrj...` and `masterSheetId` is also `1J9Zrj...`:
  1. Primary Sheet ("Sổ Con" `1PaHkFMd...`) is **NOT** receiving submissions on the live deployment.
  2. The condition `masterSheetId !== primarySheetId` evaluates to `false`, so dual-sync logic is effectively running single-sync into the Master Sheet only!

---

## 2. Logic Chain

1. **Premise:** Requirement R3 dictates complete SEO metadata (title, description, og:*, twitter:*, canonical, favicon, robots.txt).
   - **Observation:** `index.html` lacks canonical URL, OpenGraph tags, and Twitter Cards. `public/favicon.svg` has an outdated "30D" badge. `robots.txt` does not disallow `/api/` or declare sitemap.
   - **Inference:** Search engines and social media platforms (Facebook, Zalo, Telegram, X) currently scrape default or blank link previews without imagery or structured data.
   - **Action Required:** Update `index.html` head, fix `favicon.svg`, add `public/sitemap.xml`, and update `public/robots.txt`.

2. **Premise:** Requirement R4 demands testing the `/api/register` pipeline with valid test payloads and ensuring dual sync to Google Sheets and Telegram.
   - **Observation:** Telegram Bot `nova0410_bot` is operational (verified via Telegram `getMe` API). Google Service Account authentication succeeded and verified existence of both spreadsheet tabs `'Danh Sách Học Viên'` and `'Offline FEDU'` with columns A:G matching.
   - **Observation:** Live endpoint returns Master Sheet `1J9Zrj...` for GET requests due to Vercel's existing `GOOGLE_SPREADSHEET_ID` env variable.
   - **Inference:** Submissions on the live website are currently going solely to Master Sheet `1J9Zrj...` and skipping Primary Sheet `1PaHkFMd...`.
   - **Action Required:** Update Vercel environment variables so `GOOGLE_SPREADSHEET_ID="1PaHkFMdY615FasQDcqqeia94L1662YKES7cPuFIpKhg"` (Sổ Con) and `MASTER_SPREADSHEET_ID="1J9ZrjLxTba9R-wuet1n_J_hKcL0PVtQDD_ag65Ewx04"` (Sổ Mẹ), and harden `api/register.js` variable fallbacks.

3. **Premise:** Requirement R5 requires production deployment to `https://offline.fedu.vn` and automated verification.
   - **Observation:** The domain is connected via Vercel, SSL certificate is valid, and HTTP 200 is verified.
   - **Inference:** The hosting and routing layer is fully healthy; production deployment requires executing `npx vercel --prod` after code changes and running our automated audit script to verify live HTML reflects updated SEO tags and build hashes.

---

## 3. Caveats

1. **Telegram Live Notification:** To prevent sending test spam notifications into the client's live Telegram chat (`2050406425`), the automated test script `test-register-api.mjs` was executed in dry-run mode for POST requests while validating OPTIONS, GET (200), and missing-field validation (400). Live end-to-end payload dispatch was verified structurally and credential-wise; live dispatch should be triggered during the designated testing phase using `EXECUTE_REAL_SUBMISSION=true`.
2. **Vercel CLI Environment Variable Updates:** Updating Vercel project environment variables requires either `npx vercel env add/rm` via CLI or Vercel Dashboard access. The Vercel CLI on this workstation is authenticated as `vietndj-4576` with project access to `viet-s-projects1/offline`.

---

## 4. Conclusion & Action Plan

### 4.1 Changes for Requirement R3 (SEO & Metadata)
* **File `index.html`:**
  Add the following tags inside `<head>`:
  ```html
  <title>Khóa Học Offline Video Marketing 2 Ngày Tại Hà Nội | FEDU</title>
  <link rel="canonical" href="https://offline.fedu.vn/" />

  <!-- OpenGraph / Facebook / Zalo -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://offline.fedu.vn/" />
  <meta property="og:title" content="Khóa Học Offline Video Marketing 2 Ngày Tại Hà Nội | FEDU" />
  <meta property="og:description" content="Khóa học offline 2 ngày tại Hà Nội do thầy Nguyễn Đức Việt trực tiếp hướng dẫn: Viết kịch bản chuyển đổi, setup 2 góc quay điện thoại, edit video chuyên nghiệp và ứng dụng AI tự động hóa." />
  <meta property="og:image" content="https://offline.fedu.vn/opengraph.jpg" />
  <meta property="og:image:width" content="1280" />
  <meta property="og:image:height" content="720" />
  <meta property="og:locale" content="vi_VN" />
  <meta property="og:site_name" content="FEDU Offline" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="https://offline.fedu.vn/" />
  <meta name="twitter:title" content="Khóa Học Offline Video Marketing 2 Ngày Tại Hà Nội | FEDU" />
  <meta name="twitter:description" content="Khóa học offline 2 ngày tại Hà Nội do thầy Nguyễn Đức Việt trực tiếp hướng dẫn: Viết kịch bản chuyển đổi, setup 2 góc quay điện thoại, edit video chuyên nghiệp và ứng dụng AI tự động hóa." />
  <meta name="twitter:image" content="https://offline.fedu.vn/opengraph.jpg" />
  ```
* **File `public/robots.txt`:**
  ```txt
  User-agent: *
  Allow: /
  Disallow: /api/

  Sitemap: https://offline.fedu.vn/sitemap.xml
  ```
* **File `public/sitemap.xml`:**
  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://offline.fedu.vn/</loc>
      <lastmod>2026-09-04</lastmod>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
  </urlset>
  ```
* **File `public/favicon.svg`:**
  Remove the `30D` badge pill or update badge text from `30D` to `FEDU`.

### 4.2 Changes for Requirement R4 (API Dual Sync & Vercel Env)
* Update `api/register.js` to ensure the Primary sheet ID is strictly segregated from Master sheet ID:
  ```js
  const primarySheetId = process.env.PRIMARY_SPREADSHEET_ID || process.env.GOOGLE_SPREADSHEET_ID || DEFAULT_PRIMARY_SPREADSHEET_ID;
  const masterSheetId = process.env.MASTER_SPREADSHEET_ID || DEFAULT_MASTER_SPREADSHEET_ID;
  ```
* Update Vercel Production Environment Variables via CLI:
  ```bash
  # Set Sổ Con as Primary
  npx vercel env add GOOGLE_SPREADSHEET_ID production # value: 1PaHkFMdY615FasQDcqqeia94L1662YKES7cPuFIpKhg
  npx vercel env add MASTER_SPREADSHEET_ID production # value: 1J9ZrjLxTba9R-wuet1n_J_hKcL0PVtQDD_ag65Ewx04
  ```

### 4.3 Deployment & Verification Scripts (Requirement R5)
Two automated scripts are provided in `.agents/explorer_survey_3/` and recommended to be copied to `scripts/`:
1. `scripts/verify-production.mjs`: Automated deployment audit (DNS, SSL, HTTP 200, assets, API health, SEO tags).
2. `scripts/test-register-api.mjs`: Registration endpoint test suite (OPTIONS, 400 validation, 200 GET, and live POST).

---

## 5. Verification Method

### 5.1 Run Local TypeScript & Build Audit
```bash
npm run typecheck
npm run build
```
*Expected result:* 0 errors, JavaScript gzip bundle < 120KB (`dist/assets/index-*.js` is ~96.09KB).

### 5.2 Test `/api/register` Endpoint
```bash
node .agents/explorer_survey_3/test-register-api.mjs
```
*Expected result:*
- `[TEST 1] GET /api/register: PASS (HTTP 200 healthy)`
- `[TEST 2] OPTIONS /api/register: PASS (HTTP 200 CORS allowed)`
- `[TEST 3] POST missing phone: PASS (HTTP 400 validation error)`
- To perform a single live test submission:
  ```bash
  EXECUTE_REAL_SUBMISSION=true node .agents/explorer_survey_3/test-register-api.mjs
  ```

### 5.3 Verify Production Deployment & Live SEO
```bash
node .agents/explorer_survey_3/verify-production.mjs
```
*Expected result:*
- DNS Resolution: PASS
- SSL Certificate: PASS (Valid > 80 days)
- Homepage HTTP 200: PASS
- Robots.txt: PASS
- Key Assets: PASS
- SEO Canonical, OpenGraph, Twitter Cards: PASS (after `index.html` update and deployment).

### 5.4 Invalidation Conditions
This survey is invalidated if:
1. Google Service Account credentials (`form-feedback-offline@vietndj-git-cms.iam.gserviceaccount.com`) are revoked in Google Cloud Console.
2. The Telegram Bot token for `nova0410_bot` is rotated without updating `.env` / Vercel.
3. Domain DNS records for `offline.fedu.vn` are redirected away from Vercel.
