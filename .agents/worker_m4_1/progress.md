# Progress: Worker M4 (Registration Flow & API Testing)

Last visited: 2026-09-04T00:51:00Z

## Status
- [x] Initialized workspace and verified DISPATCH.md and BRIEFING.md
- [x] Investigated codebase:
  - Discovered Vercel environment variable conflict where `GOOGLE_SPREADSHEET_ID` was set to Master Sheet ID (`1J9Zrj...`) instead of Primary Sheet (`1PaHkFMd...`), disabling dual sync on live.
  - Discovered that having both `api/register.js` and `api/register.ts` causes Vercel build conflict ("Two or more files have conflicting paths or names").
  - Confirmed Vite resolves `.js` imports to `.ts` seamlessly for ESM handler parity.
- [x] Hardened `/api/register.ts`:
  - Migrated from `api/register.js` to strongly-typed TypeScript `api/register.ts` with zero type errors.
  - Implemented self-healing `getSpreadsheetConfig()` that correctly detects when `GOOGLE_SPREADSHEET_ID` points to Master Sheet and falls back to Sổ Con (`1PaHkFMd...`), guaranteeing dual sync in all scenarios.
  - Added HTML escaping (`escapeHtml`) for all Telegram message interpolations to prevent malformed payload drops.
  - Added AbortSignal timeout handling (6s for Telegram, 7s for Google Sheets) to prevent serverless function hangs.
  - Dual sync appends to both Primary Sheet (`'Danh Sách Học Viên'`) and Master Sheet (`'Offline FEDU'`).
  - Added detailed structured error and sync responses `{ success: true, message: '...', item: ..., sync: { ... } }` and `{ success: false, error: '...' }`.
  - Added phone validation (9-15 digits), empty body detection, and malformed JSON detection.
- [x] Updated Vercel production environment variables:
  - Added `PRIMARY_SPREADSHEET_ID` = `1PaHkFMdY615FasQDcqqeia94L1662YKES7cPuFIpKhg`
  - Added `MASTER_SPREADSHEET_ID` = `1J9ZrjLxTba9R-wuet1n_J_hKcL0PVtQDD_ag65Ewx04`
  - Updated `GOOGLE_SPREADSHEET_ID` in production to `1PaHkFMdY615FasQDcqqeia94L1662YKES7cPuFIpKhg`
- [x] Verified build & compiler status:
  - `npx tsc --noEmit` on `api/register.ts`: 0 errors.
  - `npm run typecheck`: 0 errors.
  - `npm run build`: 0 errors (gzip bundle: 95.98 KB < 120 KB).
  - `npx vercel build --yes`: Success, generates `register.func` lambda.
- [x] Ran live API tests and dual sheet verification:
  - Executed real submission test via `test-register-api.mjs`: HTTP 200 `{ success: true }`.
  - Verified with direct Google Sheets API query: Row appended to BOTH Primary Sheet (`'Danh Sách Học Viên'`, row 10) and Master Sheet (`'Offline FEDU'`, row 10).
  - Verified Telegram bot alert dispatched to Chat ID `2050406425`.
  - Executed 22 direct handler unit tests: 22/22 PASS.
  - Executed 9 config permutation tests: 9/9 PASS.
  - Executed 9 HTTP error handling tests: 9/9 PASS.
  - Ran full E2E test suite (`node tests/e2e/runner.mjs`): 99/99 active tests PASS.
- [x] Completing `BRIEFING.md` and `handoff.md`.
