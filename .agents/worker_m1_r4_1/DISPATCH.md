# Dispatch: Worker M1 Iteration 4 - Purge Leaked Test String & Robust Baseline Test Restoration

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Mandatory Inputs (Read first!)
- `/Users/vietmac/Documents/CODE/offline/.agents/ORIGINAL_REQUEST.md`
- `/Users/vietmac/Documents/CODE/offline/PROJECT.md`
- Forensic Audit Report: `/Users/vietmac/Documents/CODE/offline/.agents/auditor_m1_r3_1/handoff.md`
- Reviewer Report: `/Users/vietmac/Documents/CODE/offline/.agents/reviewer_m1_r3_1/handoff.md`

## Scope & Deliverables
1. **Restore Authentic Production Copy in `src/content.ts:618`**:
   Replace:
   ```typescript
   subheadline: "🔥🚀 Tiếng Việt có dấu: Ắ, Ặ, Ỡ, Ợ, Ứ, Ự, Đ... và RTL: مرحبا بالعالم و שלום עולם 👨‍👩‍👧‍👦",
   ```
   With the authentic production Vietnamese text:
   ```typescript
   subheadline: "Khóa học offline 2 ngày thực chiến (từ sáng đến chiều), cầm tay chỉ việc giúp chủ doanh nghiệp, người làm chuyên môn, đào tạo và dịch vụ làm chủ toàn bộ quy trình sản xuất video từ A–Z. Không cần rành công nghệ hay giỏi kỹ thuật từ trước.",
   ```

2. **Harden `tests/stress-m1.mjs` Baseline Architecture**:
   - In `tests/stress-m1.mjs`, obtain `INITIAL_CONTENT` via `git show HEAD:src/content.ts` (or fallback to an immutable authentic backup file `tests/content.baseline.ts`) rather than reading the potentially mutated live disk state.
   - Ensure the cleanup / `restoreInitial()` function restores `src/content.ts` strictly to the clean git baseline.
   - Ensure cleanup runs in `process.on('exit')`, `process.on('SIGINT')`, and in top-level `finally`.

3. **Empirical Verification**:
   - Run the auditor's check to verify `src/content.ts` contains 0 test artifacts:
     ```bash
     node -e '
     const fs = require("fs");
     const content = fs.readFileSync("src/content.ts", "utf-8");
     if (content.includes("مرحبا بالعالم") || content.includes("שלום עולם") || content.includes("MUTATION_TEST")) {
       console.error("FAIL: Test artifact found in src/content.ts!");
       process.exit(1);
     } else {
       console.log("PASS: Clean");
     }
     '
     ```
   - Run `node tests/stress-m1.mjs` (must pass 23/23).
   - Check `src/content.ts` AGAIN after running `tests/stress-m1.mjs` to ensure 100% clean restoration.
   - Run `node tests/stress-m1-boundaries.mjs` (must pass 7/7).
   - Run `node tests/e2e/runner.mjs` (must pass 99/99).
   - Run `npm run typecheck` and `npm run build` (0 errors, bundle gzip < 120 KB).

4. **Handoff Report**:
   - Update `progress.md` with timestamps.
   - Write handoff to `/Users/vietmac/Documents/CODE/offline/.agents/worker_m1_r4_1/handoff.md`.
   - Send completion message to parent.

## Exclusive Write Ownership
- `src/content.ts`
- `tests/stress-m1.mjs`
- `tests/content.baseline.ts` (if creating baseline fixture)
- `.agents/worker_m1_r4_1/*`
Do NOT touch other components or `index.html`.

## 2026-09-04T01:37:02Z
You are Worker M1 Iteration 4 for offline.fedu.vn.
Your working directory is: /Users/vietmac/Documents/CODE/offline/.agents/worker_m1_r4_1/
You MUST read:
- /Users/vietmac/Documents/CODE/offline/.agents/ORIGINAL_REQUEST.md
- /Users/vietmac/Documents/CODE/offline/PROJECT.md
- /Users/vietmac/Documents/CODE/offline/.agents/worker_m1_r4_1/DISPATCH.md
- /Users/vietmac/Documents/CODE/offline/.agents/auditor_m1_r3_1/handoff.md
- /Users/vietmac/Documents/CODE/offline/.agents/reviewer_m1_r3_1/handoff.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Scope & Deliverables:
1. Restore authentic production copy in `src/content.ts:618`:
   Replace test string with authentic Vietnamese text:
   `subheadline: "Khóa học offline 2 ngày thực chiến (từ sáng đến chiều), cầm tay chỉ việc giúp chủ doanh nghiệp, người làm chuyên môn, đào tạo và dịch vụ làm chủ toàn bộ quy trình sản xuất video từ A–Z. Không cần rành công nghệ hay giỏi kỹ thuật từ trước.",`
2. Harden `tests/stress-m1.mjs`:
   - Initialize baseline from an immutable clean copy or `git show HEAD:src/content.ts` (sanitized of test payloads).
   - Ensure clean restoration in `finally` and exit handlers.
3. Verify:
   - Zero test artifacts in `src/content.ts` before and after running tests.
   - `node tests/stress-m1.mjs` passes 23/23.
   - `node tests/stress-m1-boundaries.mjs` passes 7/7.
   - `node tests/e2e/runner.mjs` passes 99/99.
   - `npm run typecheck` and `npm run build` pass (0 errors, gzip < 120 KB).
4. Maintain `progress.md`, write `handoff.md`, and notify parent agent via `send_message`.
