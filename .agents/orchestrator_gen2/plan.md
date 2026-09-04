# Master Execution Plan — Orchestrator Generation 2

## Objective
Drive `offline.fedu.vn` project to 100% completion across all milestones and criteria:
- M1 (Fast Modification Architecture): Certified PASS at Gate Iteration 2.
- M2 (Performance Optimization & Cleanup): 51 dead assets pruned (~90.72 MB), build/typecheck 100% clean, main JS gzip < 120 KB.
- M3 (SEO Metadata): Complete & verified (inherited).
- M4 (Registration API & Fallback): Complete & verified (inherited).
- M5 (Production Deployment & Online Verification): Live on `https://offline.fedu.vn`, HTTP 200, valid SSL, live content verified, 101/101 E2E tests pass.
- Final Acceptance: Complete synthesis report delivered to Sentinel.

---

## Phase 1: M1 Gate Iteration 2 Squad Evaluation
1. Dispatch verification squad in parallel:
   - `reviewer_m1_r2_1` (`teamwork_preview_reviewer`): Validate component purity, typecheck, build, zero hardcoded copy.
   - `reviewer_m1_r2_2` (`teamwork_preview_reviewer`): Validate `CONTENT_MAP.md` mapping, interface contract, mutation tests.
   - `challenger_m1_r2_1` (`teamwork_preview_challenger`): Run adversarial stress harness `tests/stress-m1.mjs` and edge case inputs.
   - `challenger_m1_r2_2` (`teamwork_preview_challenger`): Test rapid content mutation live reflection without component changes.
   - `auditor_m1_r2_1` (`teamwork_preview_auditor`): Perform rigorous forensic audit for zero hardcoding, zero facade, zero leftover test tokens.
2. Collect reports, evaluate verdicts in `GATE_STATUS.md`.
3. If gate passes, update `PROJECT.md` M1 status to `DONE`.

---

## Phase 2: Milestone M2 Execution & Verification
1. Dispatch `worker_m2_1` (`teamwork_preview_worker`):
   - Delete 51 dead assets (~90.72 MB) cataloged in `.agents/explorer_survey_2/handoff.md`.
   - Remove root draft `tong-hop-logic-3-tang-va-kich-ban-4-buoc.md`.
   - Protect essential SEO assets: `public/opengraph.jpg`, `public/robots.txt`, `public/favicon.svg`.
   - Run `npm run typecheck` and `npm run build`.
   - Verify bundle size: main JS gzip < 120 KB.
2. Dispatch verification squad for M2:
   - Reviewer: Verify no broken asset references in UI, clean build.
   - Challenger: Asset existence and 404 stress test.
   - Auditor: Forensic check ensuring no required assets were accidentally stripped and build is genuine.
3. Gate check: Update `PROJECT.md` M2 status to `DONE`.

---

## Phase 3: Milestone M5 Execution & Verification
1. Dispatch `worker_m5_1` (`teamwork_preview_worker`):
   - Deploy project to production connected to `https://offline.fedu.vn`.
   - Execute automated verification script `.agents/explorer_survey_3/verify-production.mjs`.
   - Execute full E2E test suite `node tests/e2e/runner.mjs` ensuring 100% tests pass (101/101).
2. Dispatch verification squad for M5:
   - Reviewer: Validate live URL, SSL certificate validity, HTTP status.
   - Auditor: Verify production deployment authenticity, check that live domain serves actual build output.
3. Gate check: Update `PROJECT.md` M5 status to `DONE`.

---

## Phase 4: Final Acceptance & Sentinel Reporting
1. Synthesize all verified outcomes across F1-F13 and R1-R5.
2. Produce comprehensive completion report.
3. Send message to Sentinel (`75669d2a-df9b-416f-9f84-f50a53482127`).
