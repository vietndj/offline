# Dispatch: Worker M1 - Fast Modification Architecture (Single Source of Truth)

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Mandatory Inputs (Read first!)
- `/Users/vietmac/Documents/CODE/offline/.agents/ORIGINAL_REQUEST.md` (Verbatim user request)
- `/Users/vietmac/Documents/CODE/offline/PROJECT.md` (Milestone M1 scope, Architecture, Code layout)
- `/Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_1/handoff.md` (Full 21-domain schema, hardcoded strings inventory across all 19 files, and CONTENT_MAP blueprint)

## Scope & Deliverables
1. **Centralize 100% of Content into `src/content.ts`**:
   - Follow the comprehensive 21-domain `ContentData` interface designed in Explorer 1's handoff report.
   - Migrate ALL remaining hardcoded copy, headings, body text, stats, video links, images, FAQs, and labels from all 14 sections, 4 components, `src/pages/SuccessPage.tsx`, and `src/App.tsx` into `src/content.ts`.
   - Ensure `src/content.ts` is fully typed and exported as `export const CONTENT = { ... };`.

2. **Refactor UI into Pure View Components**:
   - Update every component in `src/sections/` and `src/components/`, `src/pages/SuccessPage.tsx`, and `src/App.tsx` to read directly and exclusively from `CONTENT`.
   - Ensure ZERO hardcoded text or UI strings remain in `src/sections/`.
   - Maintain all existing animations, Tailwind styling, Lucide icons, and layout structure intact.

3. **Create `CONTENT_MAP.md`**:
   - Write comprehensive `CONTENT_MAP.md` at project root mapping every UI section and visual block to its corresponding key in `src/content.ts`, with line numbers and field descriptions so anyone can locate and edit content in seconds.

4. **Verify Quick Edit Capability**:
   - Execute a verified quick-edit test: modify a test field in `src/content.ts`, confirm in build/render that the change is reflected cleanly without touching any TSX component, and restore or preserve cleanly.

5. **Build & Typecheck Verification**:
   - Run `npm run typecheck` and `npm run build` and ensure 100% success with 0 errors and 0 warnings.
   - Document verification commands and build outputs in your handoff report.

6. **Handoff Report**:
   - Update your `progress.md` with timestamps.
   - Write your complete handoff report to `/Users/vietmac/Documents/CODE/offline/.agents/worker_m1_1/handoff.md`.
   - Notify parent agent upon completion via `send_message`.

## Exclusive Write Ownership
- `src/content.ts`
- `src/sections/*`
- `src/components/*`
- `src/pages/SuccessPage.tsx`
- `src/App.tsx`
- `CONTENT_MAP.md`
- `.agents/worker_m1_1/*`
Do NOT touch `public/` assets, `index.html`, or `api/register.ts`.

## 2026-09-04T00:42:40Z
<USER_REQUEST>
You are Worker M1 for offline.fedu.vn.
Your working directory is: /Users/vietmac/Documents/CODE/offline/.agents/worker_m1_1/
You MUST read:
- /Users/vietmac/Documents/CODE/offline/.agents/ORIGINAL_REQUEST.md
- /Users/vietmac/Documents/CODE/offline/PROJECT.md
- /Users/vietmac/Documents/CODE/offline/.agents/worker_m1_1/DISPATCH.md
- /Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_1/handoff.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Scope & Deliverables:
1. Centralize 100% of copywriting, stats, video links, images, FAQs into `src/content.ts` using the comprehensive 21-domain schema from Explorer 1.
2. Refactor all components in `src/sections/` and `src/components/`, `src/pages/SuccessPage.tsx`, and `src/App.tsx` into pure view components consuming `CONTENT`. Zero hardcoded copy must remain in `src/sections/`.
3. Create `CONTENT_MAP.md` at project root mapping all UI components to `content.ts`.
4. Perform and document quick edit verification test (modify a field in `content.ts` and confirm instant UI reflection without changing component code).
5. Ensure `npm run typecheck` and `npm run build` pass with 100% success and 0 errors/warnings.
6. Maintain `progress.md` with timestamps, write `handoff.md`, and notify parent agent via `send_message`.

Exclusive write ownership:
- `src/content.ts`
- `src/sections/*`
- `src/components/*`
- `src/pages/SuccessPage.tsx`
- `src/App.tsx`
- `CONTENT_MAP.md`
- `.agents/worker_m1_1/*`
Do NOT touch `public/` assets, `index.html`, or `api/register.ts`.
</USER_REQUEST>
