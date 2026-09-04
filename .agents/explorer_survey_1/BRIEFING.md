# BRIEFING — 2026-09-04T07:39:30+07:00

## Mission
Investigate content and UI architecture of offline.fedu.vn, inventory hardcoded strings/media/stats, and design single-source-of-truth structure (`src/content.ts`) & `CONTENT_MAP.md` for fast modification.

## 🔒 My Identity
- Archetype: explorer
- Roles: Content & UI architecture investigation, single-source-of-truth design, content mapping
- Working directory: /Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_1
- Original parent: 3d3c0102-5dd3-48c2-a77b-5fc4bbd0d697
- Milestone: Survey & Content Architecture Design

## 🔒 Key Constraints
- Read-only investigation — do NOT modify application source code
- Files in .agents/ only for metadata/reports/handoffs
- Self-contained handoff.md with 5 components
- Communicate results via send_message to parent

## Current Parent
- Conversation ID: 3d3c0102-5dd3-48c2-a77b-5fc4bbd0d697
- Updated: 2026-09-04T07:39:30+07:00

## Investigation State
- **Explored paths**:
  - `src/App.tsx`
  - `src/content.ts` (840 lines)
  - `src/sections/HeroSection.tsx`
  - `src/sections/ProofSection.tsx`
  - `src/sections/DefinitionSection.tsx`
  - `src/sections/GrowthChartSection.tsx`
  - `src/sections/MetaphorsSection.tsx`
  - `src/sections/PainSection.tsx`
  - `src/sections/CurriculumSection.tsx`
  - `src/sections/BannerCta.tsx`
  - `src/sections/ShowcaseSection.tsx`
  - `src/sections/CaseStudySection.tsx`
  - `src/sections/TargetSection.tsx`
  - `src/sections/InstructorSection.tsx`
  - `src/sections/RegisterSection.tsx`
  - `src/sections/FaqSection.tsx`
  - `src/components/Navbar.tsx`
  - `src/components/Footer.tsx`
  - `src/components/StickyBottomCta.tsx`
  - `src/components/RegisterModal.tsx`
  - `src/pages/SuccessPage.tsx`
  - `index.html`
  - `api/register.js`
- **Key findings**:
  - `src/content.ts` exists (840 lines) but only covers ~55% of the UI content.
  - Several components are completely hardcoded and do NOT import `content.ts` at all: `DefinitionSection.tsx`, `RegisterSection.tsx`, `Navbar.tsx`, `Footer.tsx`, `StickyBottomCta.tsx`, `RegisterModal.tsx`, `SuccessPage.tsx`.
  - In sections that DO import `content.ts` (e.g. `ProofSection.tsx`, `PainSection.tsx`, `CurriculumSection.tsx`), critical blocks like `proofTabs` (Meta reports), 3 action pillars, event photos, modal labels, and category names are hardcoded directly in TSX.
  - In `App.tsx`, `BannerCta` has hardcoded props passed directly in JSX.
  - `npm run typecheck` and `npm run build` both succeed (gzip JS is 96.09 kB, under 120 kB threshold).
  - Designed full schema expansion for `src/content.ts` with 21 root categories to achieve 100% Single Source of Truth.
- **Unexplored areas**: None for UI/Content scope.

## Key Decisions Made
- Cataloged every hardcoded string, stat, image, video link, and UI label across all 19 TSX files.
- Structured new unified schema `ContentData` covering 100% of text and media.
- Prepared `CONTENT_MAP.md` specification for rapid editing.

## Artifact Index
- handoff.md — Comprehensive findings & architecture specification
- progress.md — Liveness & step tracking
- BRIEFING.md — Working memory & identity
