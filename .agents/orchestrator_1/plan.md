# Orchestrator Plan: offline.fedu.vn Optimization

## Objectives
Deliver full optimization of offline.fedu.vn meeting all 5 core requirements:
1. R1: Fast Modification Architecture (`src/content.ts` Single Source of Truth, pure view components, `CONTENT_MAP.md`, quick edit verification)
2. R2: Performance Optimization & Source Cleanup (unused assets cleanup, bundle optimization < 120KB gzip, 0 build/typecheck errors)
3. R3: SEO & Social Share Metadata (meta tags, OG, Twitter Card, Favicon, canonical, robots.txt)
4. R4: Registration Flow & API Testing (/api/register, Google Sheets, Telegram, error fallbacks)
5. R5: Production Deployment & Online Verification (live deploy, automated verification script HTTP 200, SSL, live content check, 100% E2E test pass)

## Workflow Phases
- [ ] Phase 0: Survey & Feature Inventory (Spawn 3 Explorers)
  - Explorer 1: Content & UI architecture (sections, components, hardcoded copy, content.ts structure)
  - Explorer 2: Build, bundle, performance, and asset cleanup analysis
  - Explorer 3: SEO, API (/api/register, Sheets/Telegram), deployment environment & domains
  - Synthesize findings into `PROJECT.md`
- [ ] Phase 1: Dual Track Execution
  - Track A: E2E Testing Orchestration (Opaque-box test harness, Tiers 1-4, publication of `TEST_READY.md`)
  - Track B: Milestone Implementation Orchestration
    - M1: Fast Modification Architecture (Single Source of Truth)
    - M2: Performance Optimization & Source Cleanup
    - M3: SEO & Social Share Metadata
    - M4: Registration Flow & API Testing
    - M5: Production Deployment, Online Verification & E2E Acceptance
- [ ] Phase 2: Final Acceptance, Verification Audit, and Completion Report to Sentinel
