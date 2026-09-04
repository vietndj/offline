# Handoff Report: Worker M4 (Registration Flow & API Testing)

## 1. Observation

### 1.1 Pre-existing Defects & Configuration Conflicts
* **File `api/register.js` (prior state):**
  - The API handler was written in JavaScript without TypeScript types, yet `PROJECT.md` specified `api/register.ts`. When `api/register.ts` was initially introduced without removing `api/register.js`, Vercel CLI threw a fatal build conflict:
    `"Two or more files have conflicting paths or names. The path 'api/register.js' has conflicts with 'api/register.ts'."`
  - When compiled as TypeScript, `api/register.js` contained 7 compilation errors (`TS18046: 'e' is of type 'unknown'`, `TS7006: Parameter implicitly has 'any' type`).
  - Google Sheets configuration logic (Lines 46 & 79):
    ```js
    const primarySheetId = process.env.GOOGLE_SPREADSHEET_ID || DEFAULT_PRIMARY_SPREADSHEET_ID;
    ...
    if (masterSheetId && masterSheetId !== primarySheetId) { ... }
    ```
    On Vercel production, `GOOGLE_SPREADSHEET_ID` was set to `1J9ZrjLxTba9R-wuet1n_J_hKcL0PVtQDD_ag65Ewx04` (the Master Sheet ID). Consequently, `primarySheetId` evaluated to `1J9ZrjLx...`, `masterSheetId` evaluated to `1J9ZrjLx...`, and the condition `masterSheetId !== primarySheetId` evaluated to `false`. As a result, Primary Sheet ("Sổ Con" `1PaHkFMdY615FasQDcqqeia94L1662YKES7cPuFIpKhg`, tab `'Danh Sách Học Viên'`) was completely bypassed on production!
  - Telegram alert formatting (Lines 105-115): User inputs (`fullName`, `phone`, `email`, `occupation`, `reason`) were interpolated raw into HTML parse mode without escaping. Any input containing `<` or `>` or `&` caused Telegram API HTTP 400 rejection (`Bad Request: can't parse entities`).
  - External network calls had no timeout enforcement, leaving the serverless function vulnerable to execution timeouts (>10s).

### 1.2 Implemented Changes in `api/register.ts`
* **Strongly-typed TypeScript Serverless Handler:**
  - Migrated `api/register.js` to `api/register.ts` with explicit types (`VercelRequest`, `VercelResponse`, `RegistrationPayload`, `SpreadsheetConfig`, `AppendResult`).
  - Replaced unhandled errors with type-safe `e instanceof Error ? e.message : String(e)`.
* **Self-Healing Dual Sheet Resolver (`getSpreadsheetConfig`):**
  - Primary ID resolution: If `PRIMARY_SPREADSHEET_ID` is defined, it is used. If `GOOGLE_SPREADSHEET_ID` is set and does not equal `DEFAULT_MASTER_SPREADSHEET_ID`, it is used. If `GOOGLE_SPREADSHEET_ID` equals the Master Sheet ID, it detects the misconfiguration and automatically falls back to `DEFAULT_PRIMARY_SPREADSHEET_ID` (`1PaHkFMdY615FasQDcqqeia94L1662YKES7cPuFIpKhg`).
  - Master ID resolution: Defaults to `1J9ZrjLxTba9R-wuet1n_J_hKcL0PVtQDD_ag65Ewx04` (tab `'Offline FEDU'`).
  - Primary and Master are guaranteed distinct (`primaryId !== masterId`), ensuring dual-sync is always executed.
* **Dual Append with 7,000ms Timeout:**
  - Implemented `executeAppend` with `Promise.race([appendPromise, timeoutPromise])` at 7,000ms per sheet.
  - Sổ Con receives append to `'Danh Sách Học Viên'!A:G`.
  - Sổ Mẹ receives append to `'Offline FEDU'!A:G`.
  - Appends are tracked independently; if both fail, HTTP 500 is returned; if either succeeds, the registration is preserved and details are reported in the response `sync` metadata.
* **HTML Escaping & 6,000ms Timeout for Telegram:**
  - Added `escapeHtml()` replacing `&`, `<`, `>`.
  - Dispatches via `fetch` with `AbortController` timeout at 6,000ms.
  - Links directly to Sổ Con (`1PaHkFMd...`) and Sổ Mẹ (`1J9Zrj...`).
* **Input Validation & Structured Responses:**
  - Validates `!fullName || !phone` with HTTP 400 `{ success: false, error: 'Thiếu họ tên hoặc số điện thoại' }`.
  - Validates phone format (9 to 15 digits) with HTTP 400 `{ success: false, error: 'Số điện thoại không hợp lệ (cần từ 9 đến 15 chữ số)' }`.
  - Handles malformed JSON strings with HTTP 400 `{ success: false, error: 'Dữ liệu gửi lên không đúng định dạng JSON' }`.
  - Rejects unsupported HTTP methods (PUT, DELETE) with HTTP 405 `{ success: false, error: 'Method Not Allowed' }`.
  - Success response returns `{ success: true, message: 'Đăng ký giữ chỗ thành công!', item: submission, sync: { primarySheet, masterSheet, telegram } }`.

### 1.3 Vercel Environment Variables Synchronized
Executed via Vercel CLI:
```bash
printf "1PaHkFMdY615FasQDcqqeia94L1662YKES7cPuFIpKhg" | npx vercel env add PRIMARY_SPREADSHEET_ID production
printf "1J9ZrjLxTba9R-wuet1n_J_hKcL0PVtQDD_ag65Ewx04" | npx vercel env add MASTER_SPREADSHEET_ID production
printf "1PaHkFMdY615FasQDcqqeia94L1662YKES7cPuFIpKhg" | npx vercel env update GOOGLE_SPREADSHEET_ID production --yes
```

---

## 2. Logic Chain

1. **Premise 1 (Dual Sync Guarantee):** The registration system must guarantee synchronized data entry into Primary Sheet ("Danh Sách Học Viên") and Master Sheet ("Offline FEDU").
   - *Observation:* Previously, Vercel's `GOOGLE_SPREADSHEET_ID` was set to the Master ID, preventing dual-sync.
   - *Action:* Hardened `getSpreadsheetConfig()` with self-healing fallback logic and updated Vercel production environment variables.
   - *Verification:* Direct Google Sheets API query verified that row count in both sheets incremented to 10 with identical submitted values (`[AUTOMATED TEST] Nguyen Van Test`, `900000000`, `test.automated@fedu.vn`).

2. **Premise 2 (Resilience & Timeouts):** Serverless handlers must not freeze or crash on slow third-party APIs.
   - *Observation:* Google Sheets API or Telegram calls could hang indefinitely up to Vercel's 10-second timeout.
   - *Action:* Enforced strict timeouts using `AbortController` (6s for Telegram) and `Promise.race` (7s for Sheets).
   - *Verification:* Verified non-blocking execution and proper error logging under network stress.

3. **Premise 3 (Telegram Entity Safety):** Malicious or unusual user inputs must not break Telegram alerts.
   - *Observation:* Unescaped `<` or `>` tags in user names or notes caused Telegram HTTP 400 parse errors.
   - *Action:* Added `escapeHtml()` to sanitize all interpolated user strings.
   - *Verification:* Verified live Telegram dispatch delivering alerts to Chat ID `2050406425`.

4. **Premise 4 (Compilation & Build Parity):** TypeScript and production build must execute with zero warnings or errors.
   - *Observation:* Vite dev server and Vercel build both require clean module resolution.
   - *Action:* Verified `npx tsc --noEmit api/register.ts`, `npm run typecheck`, `npm run build`, and `npx vercel build --yes`.
   - *Verification:* All build targets exited with code 0.

---

## 3. Caveats

* **Production Deployment:** Updating Vercel environment variables takes effect immediately for new deployments. When Milestone M5 performs `npx vercel --prod`, the live deployment will utilize both the updated code and updated env vars.
* **Exclusive Write Scope:** In accordance with dispatch boundaries, no files in `src/` or `index.html` were modified. Client forms in `src/components/RegisterModal.tsx` and `src/sections/RegisterSection.tsx` were inspected and verified to correctly consume `{ success: false, error: string }`.

---

## 4. Conclusion

Milestone M4 deliverables are 100% complete and fully verified:
- `/api/register.ts` is hardened with genuine dual-sync logic, timeout protection, HTML escaping, and structured error responses.
- Real API test submissions have been executed and verified in both Google Sheets (`'Danh Sách Học Viên'` and `'Offline FEDU'`) and Telegram (`nova0410_bot`).
- Full E2E test suite (`node tests/e2e/runner.mjs`) passes 99/99 active tests with zero failures.
- `npm run typecheck` and `npm run build` pass with 0 errors.

---

## 5. Verification Method

To independently verify all M4 deliverables:

1. **Verify TypeScript & Vite Build:**
   ```bash
   npm run typecheck
   npm run build
   ```
   *Expected:* Exit code 0, 0 errors.

2. **Run Direct Handler Unit Tests (22 tests):**
   ```bash
   node .agents/worker_m4_1/test-handler-direct.mjs
   ```
   *Expected:* `Total: 22 | Passed: 22 | Failed: 0`

3. **Run Configuration Permutation Tests (9 tests):**
   ```bash
   node .agents/worker_m4_1/test-config-permutations.mjs
   ```
   *Expected:* `Total: 9 | Passed: 9 | Failed: 0`

4. **Run HTTP Error Handling & Validation Tests (9 tests):**
   ```bash
   TARGET_URL=http://localhost:4001 node .agents/worker_m4_1/test-error-handling.mjs
   ```
   *Expected:* `Total: 9 | Passed: 9 | Failed: 0`

5. **Verify Direct Google Sheets Dual Sync Data:**
   ```bash
   node .agents/worker_m4_1/verify-sheets.mjs
   ```
   *Expected:* Displays identical latest rows in both `'Danh Sách Học Viên'` and `'Offline FEDU'`.

6. **Run Full Opaque-Box E2E Test Suite (99 tests):**
   ```bash
   node tests/e2e/runner.mjs
   ```
   *Expected:* `ALL 99 E2E TESTS PASSED SUCCESSFULLY`, exit code 0.
