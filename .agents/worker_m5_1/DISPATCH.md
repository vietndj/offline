# Dispatch: Worker M5 - Production Deployment & Online Verification

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Mandatory Inputs (Read first!)
- `/Users/vietmac/Documents/CODE/offline/.agents/ORIGINAL_REQUEST.md` (Verbatim user request, especially R5)
- `/Users/vietmac/Documents/CODE/offline/PROJECT.md`
- `/Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_3/handoff.md`
- `/Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_3/verify-production.mjs`
- `/Users/vietmac/Documents/CODE/offline/tests/e2e/runner.mjs`

## Scope & Deliverables
1. **Deploy Latest Build to Production**:
   - Run `npx vercel --prod --yes` to deploy the codebase to production for domain `https://offline.fedu.vn`.
   - Ensure deployment succeeds with a valid production deployment URL and alias assigned.
2. **Execute Automated Verification Script**:
   - Run `node .agents/explorer_survey_3/verify-production.mjs` against `https://offline.fedu.vn`.
   - Confirm all checks pass:
     - DNS Resolution: PASS
     - SSL Certificate: PASS
     - Homepage HTTP 200: PASS
     - Robots.txt: PASS
     - Key Assets (favicon.svg, opengraph.jpg): PASS
     - API Health Endpoint: PASS
     - SEO Title, Description, Canonical: PASS
     - OpenGraph Title, Description, Image: PASS
     - Twitter Card: PASS
3. **Verify Live Content Rendering**:
   - Fetch the live homepage and verify that key content strings from `src/content.ts` are rendered in the live DOM.
4. **Execute Full E2E Test Suite**:
   - Run `node tests/e2e/runner.mjs` and confirm 100% pass across Tiers 1-4.
5. **Handoff Report**:
   - Update `progress.md` with timestamps.
   - Write handoff to `/Users/vietmac/Documents/CODE/offline/.agents/worker_m5_1/handoff.md`.
   - Send completion message to parent.

## 2026-09-04T01:51:24Z
You are Worker M5 for offline.fedu.vn.
Your working directory is: /Users/vietmac/Documents/CODE/offline/.agents/worker_m5_1/
You MUST read:
- /Users/vietmac/Documents/CODE/offline/.agents/ORIGINAL_REQUEST.md
- /Users/vietmac/Documents/CODE/offline/PROJECT.md
- /Users/vietmac/Documents/CODE/offline/.agents/worker_m5_1/DISPATCH.md
- /Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_3/verify-production.mjs

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Scope & Deliverables:
1. Deploy latest build to production for domain `https://offline.fedu.vn` via `npx vercel --prod --yes`.
2. Run automated verification script: `node .agents/explorer_survey_3/verify-production.mjs`.
3. Verify live content: verify HTTP 200, valid SSL, and latest content rendered on live domain.
4. Run full E2E test suite: `node tests/e2e/runner.mjs` (must pass 100%).
5. Write handoff to `/Users/vietmac/Documents/CODE/offline/.agents/worker_m5_1/handoff.md`.
6. Send completion message to parent.
