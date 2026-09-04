# BRIEFING — 2026-09-04T01:07:35Z

## Mission
Orchestrate the end-to-end optimization of offline.fedu.vn (Single Source of Truth, Performance, SEO, Registration Flow, Production Deployment) using Dual Track Project Pattern.

## 🔒 My Identity
- Archetype: orchestrator
- Roles: orchestrator, user_liaison, human_reporter, successor
- Working directory: /Users/vietmac/Documents/CODE/offline/.agents/orchestrator_1
- Original parent: parent
- Original parent conversation ID: 75669d2a-df9b-416f-9f84-f50a53482127

## 🔒 My Workflow
- **Pattern**: Project
- **Scope document**: /Users/vietmac/Documents/CODE/offline/PROJECT.md
1. **Decompose**: Survey codebase via 3 Explorers, create Feature Inventory in PROJECT.md, decompose into milestones (M1-M5) and E2E Testing track.
2. **Dispatch & Execute**:
   - Delegate (sub-orchestrator) per milestone and E2E testing track.
   - Milestone final check: 100% E2E test pass + adversarial coverage hardening.
3. **On failure** (in this order):
   - Retry: nudge stuck agent or re-send task
   - Replace: spawn fresh agent with partial progress
   - Skip: proceed without (only if non-critical)
   - Redistribute: split stuck agent's remaining work
   - Redesign: re-partition decomposition
   - Escalate: report to parent (sub-orchestrators only, last resort)
4. **Succession**: At spawn count >= 16 and all subagents completed, write handoff.md, spawn successor.
- **Work items**:
  1. Survey & Feature Inventory [done]
  2. E2E Testing Suite Track [done - TEST_READY.md published]
  3. M1: Fast Modification Architecture [remediated - ready for gate re-eval]
  4. M2: Performance Optimization & Source Cleanup [planned]
  5. M3: SEO & Social Share Metadata [done]
  6. M4: Registration Flow & API Testing [done]
  7. M5: Production Deployment & Online Verification [planned]
- **Current phase**: 1 (Dual Track Execution & Remediation)
- **Current focus**: Succession to Generation 2 (Spawn count 16 reached)

## 🔒 Key Constraints
- NEVER write, modify, or create source code files directly.
- NEVER run build/test commands yourself — require workers to do so.
- NEVER investigate or explore the problem at the code level — dispatch Explorers for technical investigation.
- Use file-editing tools ONLY for metadata/state files (.md) in .agents/ folder.
- If a Forensic Auditor reports INTEGRITY VIOLATION, the milestone FAILS UNCONDITIONALLY.
- Never reuse a subagent after it has delivered its handoff — always spawn fresh.
- Hard deadline: 20 minutes from dispatch with no report -> replace immediately.

## Current Parent
- Conversation ID: 75669d2a-df9b-416f-9f84-f50a53482127
- Updated: 2026-09-04T00:36:34Z

## Succession Status
- Succession required: yes
- Spawn count: 16 / 16
- Pending subagents: none (all 16 subagents completed)
- Predecessor: none
- Successor: spawning now

## Active Timers
- Heartbeat cron: killing before succession
- Safety timer: killing before succession

## Artifact Index
- /Users/vietmac/Documents/CODE/offline/PROJECT.md — Global Project Specification & Feature Inventory
- /Users/vietmac/Documents/CODE/offline/TEST_INFRA.md — E2E Test Infrastructure
- /Users/vietmac/Documents/CODE/offline/TEST_READY.md — E2E Test Suite Ready Notice
- /Users/vietmac/Documents/CODE/offline/CONTENT_MAP.md — Fast Modification Content Map
- /Users/vietmac/Documents/CODE/offline/.agents/orchestrator_1/GATE_STATUS.md — Milestone Gate Status
- /Users/vietmac/Documents/CODE/offline/.agents/orchestrator_1/handoff.md — Generation 1 Soft Handoff
