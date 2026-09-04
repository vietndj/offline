# Dispatch: Worker M1 Iteration 2 - Fast Modification Remediation

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Mandatory Inputs (Read first!)
- `/Users/vietmac/Documents/CODE/offline/.agents/ORIGINAL_REQUEST.md` (Verbatim user request)
- `/Users/vietmac/Documents/CODE/offline/PROJECT.md`
- `/Users/vietmac/Documents/CODE/offline/.agents/explorer_m1_r2_2/handoff.md`
- `/Users/vietmac/Documents/CODE/offline/.agents/explorer_m1_r2_2/remediation_m1.patch`
- `/Users/vietmac/Documents/CODE/offline/.agents/explorer_m1_r2_3/handoff.md`
- `/Users/vietmac/Documents/CODE/offline/.agents/auditor_m1_1/handoff.md`

## Scope & Deliverables
1. **Apply Remediation Patch / Diffs**:
   - Apply `/Users/vietmac/Documents/CODE/offline/.agents/explorer_m1_r2_2/remediation_m1.patch` or implement the verified changes:
     - Centralize remaining 5 hardcoded copy strings in `src/sections/PainSection.tsx` and `src/sections/MetaphorsSection.tsx` into `src/content.ts`.
     - Strip `"Giải pháp: "` prefixes from `src/content.ts` tabs and eliminate `.replace(/^Giải pháp:\s*/, '')` in `PainSection.tsx`.
     - Revert all 5 `MUTATION_TEST_*` tokens in `src/content.ts` back to canonical production Vietnamese text.
     - Add defensive guards in `DefinitionSection.tsx`, `PainSection.tsx`, `GrowthChartSection.tsx`.
     - Remove dead import `CaseStudySection` in `src/App.tsx`.
     - Update `CONTENT_MAP.md` with new fields.
2. **Verification Suite**:
   - Run `git diff` to verify only the intended files were modified.
   - Run case-insensitive Vietnamese string check across `src/sections/` and `src/components/` ensuring 0 hardcoded strings.
   - Run `npm run typecheck` and `npm run build` (confirm 0 errors/warnings and bundle gzip < 120 KB).
   - Run `node tests/stress-m1.mjs` and confirm 23/23 tests pass.
   - Run `node tests/e2e/runner.mjs` and confirm 99/99 tests pass.
3. **Handoff Report**:
   - Update `progress.md` with timestamps.
   - Write handoff to `/Users/vietmac/Documents/CODE/offline/.agents/worker_m1_r2_1/handoff.md`.
   - Send completion message to parent.

## Exclusive Write Ownership
- `src/content.ts`
- `src/sections/*`
- `src/components/*`
- `src/App.tsx`
- `CONTENT_MAP.md`
- `.agents/worker_m1_r2_1/*`
Do NOT touch `index.html`, `public/`, or `api/`.

## 2026-09-04T01:04:20Z
<USER_REQUEST>
You are Worker M1 Iteration 2 for offline.fedu.vn.
Your working directory is: /Users/vietmac/Documents/CODE/offline/.agents/worker_m1_r2_1/
You MUST read:
- /Users/vietmac/Documents/CODE/offline/.agents/ORIGINAL_REQUEST.md
- /Users/vietmac/Documents/CODE/offline/PROJECT.md
- /Users/vietmac/Documents/CODE/offline/.agents/worker_m1_r2_1/DISPATCH.md
- /Users/vietmac/Documents/CODE/offline/.agents/explorer_m1_r2_2/handoff.md
- /Users/vietmac/Documents/CODE/offline/.agents/explorer_m1_r2_2/remediation_m1.patch
- /Users/vietmac/Documents/CODE/offline/.agents/auditor_m1_1/handoff.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Scope & Deliverables:
1. Apply the verified remediation patch `/Users/vietmac/Documents/CODE/offline/.agents/explorer_m1_r2_2/remediation_m1.patch` (or manually apply the exact diffs in `src/content.ts`, `src/sections/PainSection.tsx`, `src/sections/MetaphorsSection.tsx`, `src/sections/DefinitionSection.tsx`, `src/sections/GrowthChartSection.tsx`, `src/App.tsx`, and `CONTENT_MAP.md`).
2. Verify all 5 `MUTATION_TEST_*` tokens in `src/content.ts` are reverted back to authentic production copy.
3. Verify all remaining hardcoded strings in `PainSection.tsx` and `MetaphorsSection.tsx` are moved into `src/content.ts`.
4. Verify `.replace()` runtime regex surgery is eliminated in `PainSection.tsx`.
5. Run full verification:
   - Case-insensitive Vietnamese string grep across `src/sections/` and `src/components/` confirms 0 hardcoded strings.
   - `npm run typecheck` passes with 0 errors.
   - `npm run build` passes with 0 errors (bundle gzip < 120 KB).
   - `node tests/stress-m1.mjs` passes 23/23 tests.
   - `node tests/e2e/runner.mjs` passes 99/99 tests.
6. Maintain `progress.md` with timestamps, write `handoff.md`, and notify parent agent via `send_message`.

Exclusive write ownership:
- `src/content.ts`
- `src/sections/*`
- `src/components/*`
- `src/App.tsx`
- `CONTENT_MAP.md`
- `.agents/worker_m1_r2_1/*`
Do NOT touch `index.html`, `public/`, or `api/`.
</USER_REQUEST>

