# Dispatch: Explorer M1 Iteration 2 - Instance 1

## Mission
Analyze the full Forensic Audit failure and Reviewer/Challenger findings for Milestone M1 (Fast Modification Architecture), and formulate a comprehensive remediation strategy.

## Mandatory Inputs (Read thoroughly!)
- `/Users/vietmac/Documents/CODE/offline/.agents/ORIGINAL_REQUEST.md` (Verbatim user request)
- `/Users/vietmac/Documents/CODE/offline/PROJECT.md`
- `/Users/vietmac/Documents/CODE/offline/.agents/orchestrator_1/GATE_STATUS.md`
- FULL Forensic Audit Evidence Report: `/Users/vietmac/Documents/CODE/offline/.agents/auditor_m1_1/handoff.md`
- Reviewer & Challenger Evidence Reports:
  - `/Users/vietmac/Documents/CODE/offline/.agents/reviewer_m1_1/handoff.md`
  - `/Users/vietmac/Documents/CODE/offline/.agents/reviewer_m1_2/handoff.md`
  - `/Users/vietmac/Documents/CODE/offline/.agents/challenger_m1_1/handoff.md`
  - `/Users/vietmac/Documents/CODE/offline/.agents/challenger_m1_2/handoff.md`

## Audit Failure Evidence Summary
1. Unmigrated Hardcoded Copy:
   - `src/sections/PainSection.tsx:181`: `"B-ROLL BANK 0"`
   - `src/sections/PainSection.tsx:260`: `"AI VIẾT KỊCH BẢN 0"`
   - `src/sections/PainSection.tsx:338`: `"VIDEO THỰC CHIẾN 0"`
   - `src/sections/PainSection.tsx:462`: `"QUY TRÌNH THỰC CHIẾN 0"`
   - `src/sections/MetaphorsSection.tsx:52`: `title="Xem trên YouTube"`
   - `src/sections/PainSection.tsx:126`: regex `.replace(/^Giải pháp:\s*/, '')`
2. Test Mutation Pollution in `src/content.ts`:
   - 5 un-reverted test badges (`MUTATION_TEST_*`) left in `src/content.ts` (lines 610, 756, 1277, 1284, 1570).
3. Defensive Edge Cases & Code Hygiene:
   - `DefinitionSection.tsx:27`: highlightWord logic
   - Defensive array guards for empty/single-item arrays in `PainSection.tsx` and `GrowthChartSection.tsx`.
   - Dead import `CaseStudySection` in `src/App.tsx:11`.

## Deliverables
- Detailed remediation plan covering exact changes for `src/content.ts`, `src/sections/PainSection.tsx`, `src/sections/MetaphorsSection.tsx`, `src/sections/DefinitionSection.tsx`, `src/sections/GrowthChartSection.tsx`, `src/App.tsx`, and `CONTENT_MAP.md`.
- Case-insensitive Vietnamese regex verification command to ensure 0 remaining hardcoded strings.
- Write handoff report to: `/Users/vietmac/Documents/CODE/offline/.agents/explorer_m1_r2_1/handoff.md`.
- Send completion message to parent.

## 2026-09-04T00:57:39Z
You are Explorer M1-R2-1 for offline.fedu.vn.
Your working directory is: /Users/vietmac/Documents/CODE/offline/.agents/explorer_m1_r2_1/
You MUST read:
- /Users/vietmac/Documents/CODE/offline/.agents/ORIGINAL_REQUEST.md
- /Users/vietmac/Documents/CODE/offline/PROJECT.md
- /Users/vietmac/Documents/CODE/offline/.agents/explorer_m1_r2_1/DISPATCH.md
- FULL Forensic Audit Evidence Report: /Users/vietmac/Documents/CODE/offline/.agents/auditor_m1_1/handoff.md
- Reviewer & Challenger reports:
  - /Users/vietmac/Documents/CODE/offline/.agents/reviewer_m1_1/handoff.md
  - /Users/vietmac/Documents/CODE/offline/.agents/reviewer_m1_2/handoff.md
  - /Users/vietmac/Documents/CODE/offline/.agents/challenger_m1_1/handoff.md
  - /Users/vietmac/Documents/CODE/offline/.agents/challenger_m1_2/handoff.md

Your task is to analyze all audit integrity violations and gate feedback:
1. Define the exact fix strategy to eliminate all remaining hardcoded strings in `PainSection.tsx` and `MetaphorsSection.tsx` into `src/content.ts`.
2. Define the exact fix to eliminate runtime regex `.replace(/^Giải pháp:\s*/, '')` in `PainSection.tsx` and clean up `src/content.ts`.
3. Locate and revert all 5 contaminated `MUTATION_TEST_*` badges in `src/content.ts` back to clean production copy.
4. Fix defensive edge cases in `DefinitionSection.tsx`, `PainSection.tsx`, `GrowthChartSection.tsx` and remove unmounted import in `App.tsx`.
5. Write your comprehensive remediation report to `/Users/vietmac/Documents/CODE/offline/.agents/explorer_m1_r2_1/handoff.md`.
6. Send completion message to parent.
