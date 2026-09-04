# Dispatch: Worker M4 - Registration Flow & API Testing

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Mandatory Inputs (Read first!)
- `/Users/vietmac/Documents/CODE/offline/.agents/ORIGINAL_REQUEST.md` (Verbatim user request)
- `/Users/vietmac/Documents/CODE/offline/PROJECT.md` (Milestone M4 scope)
- `/Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_3/handoff.md` (Section 2: /api/register Architecture, Sheets & Telegram Findings)
- `/Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_3/test-register-api.mjs`

## Scope & Deliverables
1. **Inspect and Harden `/api/register.ts`**:
   - Review Google Sheets authentication and dual-sheet sync logic:
     - Primary Sheet: `'Danh Sách Học Viên'`
     - Master Sheet: `'Offline FEDU'`
   - Review Telegram Bot notification formatting and dispatch.
   - Address the configuration issue identified by Explorer 3 where `GOOGLE_SPREADSHEET_ID` was conflicting with `GOOGLE_MASTER_SPREADSHEET_ID`, ensuring dual sync functions reliably.
   - Ensure resilient timeout handling and clear JSON error responses `{ success: false, error: string }`.

2. **Execute Live API Tests**:
   - Execute `/api/register` tests with valid test payloads.
   - Verify that API returns `{ success: true }`.
   - Verify data arrival in Google Sheets and Telegram notification dispatch.
   - Verify smart fallback and informative user feedback on failure/network timeouts.

3. **Verify Build & Compilation**:
   - Verify TypeScript compilation passes without errors.

4. **Handoff Report**:
   - Update `progress.md` with timestamps.
   - Write your complete handoff report to `/Users/vietmac/Documents/CODE/offline/.agents/worker_m4_1/handoff.md`.
   - Notify parent agent upon completion via `send_message`.

## Exclusive Write Ownership
- `api/register.ts`
- `.agents/worker_m4_1/*`
Do NOT touch `src/` files or `index.html`.

## 2026-09-04T00:42:41Z
You are Worker M4 for offline.fedu.vn.
Your working directory is: /Users/vietmac/Documents/CODE/offline/.agents/worker_m4_1/
You MUST read:
- /Users/vietmac/Documents/CODE/offline/.agents/ORIGINAL_REQUEST.md
- /Users/vietmac/Documents/CODE/offline/PROJECT.md
- /Users/vietmac/Documents/CODE/offline/.agents/worker_m4_1/DISPATCH.md
- /Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_3/handoff.md
- /Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_3/test-register-api.mjs

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Scope & Deliverables:
1. Inspect and harden `/api/register.ts`:
   - Fix any environment variable or sheet ID mapping issues so dual sync to Primary Sheet (`'Danh Sách Học Viên'`) and Master Sheet (`'Offline FEDU'`) works reliably.
   - Verify Telegram bot notification formatting and dispatch.
   - Ensure timeout handling and clear `{ success: false, error: string }` on failure.
2. Run live API test with valid payload using `test-register-api.mjs` or similar test script, verifying `{ success: true }`.
3. Verify client form fallback and error handling under failure conditions.
4. Ensure TypeScript typecheck passes.
5. Maintain `progress.md` with timestamps, write `handoff.md`, and notify parent agent via `send_message`.

Exclusive write ownership:
- `api/register.ts`
- `.agents/worker_m4_1/*`
Do NOT touch `src/` or `index.html`.

