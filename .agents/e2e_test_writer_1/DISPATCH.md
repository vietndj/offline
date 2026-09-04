# Dispatch: E2E Testing Track Test Writer 1

## Mission
Build the comprehensive Opaque-box E2E Test Suite for offline.fedu.vn according to Dual Track E2E Testing requirements.

## Inputs
- `/Users/vietmac/Documents/CODE/offline/.agents/ORIGINAL_REQUEST.md` (Read verbatim first!)
- `/Users/vietmac/Documents/CODE/offline/PROJECT.md` (Feature Inventory F1 to F12)
- `/Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_3/handoff.md`
- `/Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_3/test-register-api.mjs`
- `/Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_3/verify-production.mjs`

## Responsibilities & Deliverables
1. Design and implement `TEST_INFRA.md` at project root based on the template in Project Pattern:
   - Test Philosophy: Opaque-box, requirement-driven.
   - Feature Inventory mapping for F1-F12 across Tiers 1-4.
   - Test runner command and architecture.
2. Build E2E test suites in `tests/e2e/`:
   - Tier 1: Feature Coverage (>=5 test cases per feature across all features F1-F12)
   - Tier 2: Boundary & Corner Cases (>=5 test cases per feature where boundaries exist: empty inputs, extreme phone formats, long strings, missing optional fields, special characters, malicious inputs)
   - Tier 3: Cross-Feature Combinations (pairwise interactions: content editing + bundle size check, form submission + error handling, SEO tags + production rendering)
   - Tier 4: Real-World Application Scenarios (real user journeys: visit page -> inspect sections -> click CTA -> open modal -> submit form -> verify success feedback; quick edit test verification)
3. Create an automated test runner script (e.g. `npm run test:e2e` or `node tests/e2e/runner.mjs`) with exit code 0 on pass, non-zero on failure.
4. Execute the test runner and verify it functions cleanly.
5. When all test cases and runner are in place, publish `TEST_READY.md` at project root with:
   - Command to run full test suite
   - Coverage summary table by Tier and Feature Checklist
6. Maintain `progress.md` with timestamps and write `handoff.md`.
7. Notify parent agent upon completion.

## Exclusive Write Boundaries
- `tests/e2e/`
- `TEST_INFRA.md`
- `TEST_READY.md`
- `.agents/e2e_test_writer_1/`
Do NOT modify application source code in `src/` or `index.html`.

## 2026-09-04T00:42:40Z
<USER_REQUEST>
You are the E2E Test Writer for offline.fedu.vn.
Your working directory is: /Users/vietmac/Documents/CODE/offline/.agents/e2e_test_writer_1/
You MUST read:
- /Users/vietmac/Documents/CODE/offline/.agents/ORIGINAL_REQUEST.md
- /Users/vietmac/Documents/CODE/offline/PROJECT.md
- /Users/vietmac/Documents/CODE/offline/.agents/e2e_test_writer_1/DISPATCH.md
...
</USER_REQUEST>
