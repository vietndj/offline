# Dispatch: Worker M3 - SEO & Social Share Metadata

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Mandatory Inputs (Read first!)
- `/Users/vietmac/Documents/CODE/offline/.agents/ORIGINAL_REQUEST.md` (Verbatim user request)
- `/Users/vietmac/Documents/CODE/offline/PROJECT.md` (Milestone M3 scope)
- `/Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_3/handoff.md` (Section 1: SEO, Metadata & Favicon Findings)

## Scope & Deliverables
1. **Configure SEO & Head Metadata in `index.html`**:
   - Meta title: "Khóa Học AI Thực Chiến Offline Hà Nội & TP.HCM | FEDU AI" (or exact brand standard)
   - Meta description: High-converting, accurate description of FEDU Offline AI workshop
   - Canonical URL: `<link rel="canonical" href="https://offline.fedu.vn/" />`
   - OpenGraph: `og:type` (website), `og:title`, `og:description`, `og:image` (`https://offline.fedu.vn/opengraph.jpg`), `og:url` (`https://offline.fedu.vn/`), `og:site_name`, `og:locale` (vi_VN)
   - Twitter Card: `twitter:card` (summary_large_image), `twitter:title`, `twitter:description`, `twitter:image`
   - Language attribute: `<html lang="vi">`

2. **Standardize Favicon**:
   - Update `public/favicon.svg` to clean modern FEDU branding (remove outdated "30D" badge as identified by Explorer 3).
   - Ensure `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />` is properly configured.

3. **Standardize `public/robots.txt`**:
   - Ensure standard search crawler allowance for `https://offline.fedu.vn` (`User-agent: *`, `Allow: /`, `Sitemap: https://offline.fedu.vn/sitemap.xml`).

4. **Build & Lint Verification**:
   - Run `npm run build` to ensure `index.html` changes compile cleanly into `dist/`.
   - Document changes and verification results in handoff report.

5. **Handoff Report**:
   - Update `progress.md` with timestamps.
   - Write your complete handoff report to `/Users/vietmac/Documents/CODE/offline/.agents/worker_m3_1/handoff.md`.
   - Notify parent agent upon completion via `send_message`.

## 2026-09-04T00:42:40Z
<USER_REQUEST>
You are Worker M3 for offline.fedu.vn.
Your working directory is: /Users/vietmac/Documents/CODE/offline/.agents/worker_m3_1/
You MUST read:
- /Users/vietmac/Documents/CODE/offline/.agents/ORIGINAL_REQUEST.md
- /Users/vietmac/Documents/CODE/offline/PROJECT.md
- /Users/vietmac/Documents/CODE/offline/.agents/worker_m3_1/DISPATCH.md
- /Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_3/handoff.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Scope & Deliverables:
1. Configure complete SEO tags in `index.html`: canonical URL `https://offline.fedu.vn/`, meta title, meta description, OpenGraph (og:title, og:description, og:image, og:url, og:site_name, og:locale), Twitter Card (summary_large_image).
2. Standardize `public/favicon.svg` with modern FEDU branding (remove outdated "30D" badge).
3. Standardize and verify `public/robots.txt` for search engine crawling.
4. Run `npm run build` to verify clean build.
5. Maintain `progress.md` with timestamps, write `handoff.md`, and notify parent agent via `send_message`.

Exclusive write ownership:
- `index.html`
- `public/robots.txt`
- `public/favicon.svg`
- `.agents/worker_m3_1/*`
Do NOT touch `src/` or `api/` files.
</USER_REQUEST>

