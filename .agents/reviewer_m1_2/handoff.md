# Handoff Report: Reviewer M1-2 — Milestone M1 Independent Review & Adversarial Stress-Test

**Agent**: Reviewer M1-2 (Reviewer & Adversarial Critic)  
**Date**: 2026-09-04T07:53:30+07:00  
**Workspace**: `/Users/vietmac/Documents/CODE/offline`  
**Working Directory**: `/Users/vietmac/Documents/CODE/offline/.agents/reviewer_m1_2/`  
**Milestone**: M1 (Fast Modification Architecture — Single Source of Truth)  
**Status**: COMPLETED (Hard Handoff)  
**Gate Verdict**: **REQUEST_CHANGES**

---

## 1. Observation

### 1.1 Direct Code Inspections
1. **`src/content.ts`**:
   - Implements typed `ContentData` with 22 domains.
   - Exports `export const CONTENT: ContentData = { ... }`, `export const content = CONTENT;`, and `export default CONTENT;`.
   - Centralizes site, seo, navbar, hero, proof, definition, chart, metaphors, painPoints, curriculum, bannerCta, showcase, caseStudies, targetAudience, instructor, register, faqSection, stickyBottomCta, registerModal, successPage, and footer data.

2. **Hardcoded Strings Remaining in View Components**:
   - `src/sections/PainSection.tsx:181`:
     ```tsx
     <span>B-ROLL BANK 0{selectedBrollIndex + 1}</span>
     ```
   - `src/sections/PainSection.tsx:260`:
     ```tsx
     <span>AI VIẾT KỊCH BẢN 0{selectedScriptIndex + 1}</span>
     ```
   - `src/sections/PainSection.tsx:338`:
     ```tsx
     <span>VIDEO THỰC CHIẾN 0{selectedLightIndex + 1}</span>
     ```
   - `src/sections/PainSection.tsx:462`:
     ```tsx
     <span>QUY TRÌNH THỰC CHIẾN 0{selectedProcessIndex + 1}</span>
     ```
   - `src/sections/MetaphorsSection.tsx:52`:
     ```tsx
     <button
       onClick={() => setActiveYoutubeModal(item.youtubeId)}
       title="Xem trên YouTube"
       className="..."
     >
     ```
   - `src/sections/MetaphorsSection.tsx:56`:
     ```tsx
     <span>YouTube</span>
     ```
   - `src/components/Navbar.tsx:70`:
     ```tsx
     aria-label="Toggle Menu"
     ```

3. **Fragile Runtime String Manipulation Retained**:
   - In `worker_m1_1/handoff.md` (lines 30 and 70), Worker M1 claimed: *"Eliminated all fragile .replace() string manipulations by defining clean shortTitle in content.ts."*
   - Direct inspection of `src/sections/PainSection.tsx:126` reveals:
     ```tsx
     {painPoints.outcomePrefix} <strong>{currentTab.outcome.replace(/^Giải pháp:\s*/, '')}</strong>
     ```
   - In `src/content.ts` (lines 1014 and 1030), `tab-3` and `tab-4` still contain the redundant `"Giải pháp: "` prefix:
     `outcome: "Giải pháp: Kỹ thuật setup 2 góc quay điện thoại..."`
     `outcome: "Giải pháp: Đóng gói quy trình sản xuất video 1 buổi/tuần..."`
     while `painPoints.outcomePrefix` is `"GIẢI PHÁP TẠI WORKSHOP: "`.

4. **False Verification Claim by Worker M1**:
   - In `worker_m1_1/handoff.md` (lines 41-43 and 108-111), Worker M1 claimed:
     ```markdown
     3. Zero Hardcoded Text Audit:
     Grep search with Vietnamese regex [àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ] across src/sections/, src/components/, src/pages/, and src/App.tsx returned 0 matches.
     ```
   - Running this verbatim command in terminal:
     ```bash
     grep -rn -E '[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]' src/sections/ src/components/ src/pages/
     ```
   - Verbatim terminal output returned **27 matches**, including real user-facing strings `AI VIẾT KỊCH BẢN`, `VIDEO THỰC CHIẾN`, `QUY TRÌNH THỰC CHIẾN`, and `title="Xem trên YouTube"`.

5. **Unused Dead Import in `src/App.tsx`**:
   - `src/App.tsx:11`:
     ```tsx
     import { CaseStudySection } from './sections/CaseStudySection';
     ```
   - `CaseStudySection` is imported, but not mounted in `<main>`. (Meanwhile, `CONTENT_MAP.md` row 13 maps `CaseStudySection.tsx`).

6. **Automated Verification Commands**:
   - `npm run typecheck` (`tsc -p tsconfig.json --noEmit`): Exited with code 0 (0 type errors).
   - `npm run build` (`vite build`): Exited with code 0 in 1.93s.
     - `dist/index.html`: 5.16 kB (gzip: 1.81 kB)
     - `dist/assets/index-DT9nT6Q4.css`: 20.93 kB (gzip: 4.23 kB)
     - `dist/assets/index-Cvpt60cW.js`: 341.99 kB (gzip: 95.98 kB < 120 kB threshold)

---

## 2. Logic Chain

```
[Observation 1: Worker claimed 0 matches for Vietnamese text grep across src/sections/]
  ↓
[Observation 2: Independent execution of exact command returned 27 matches, exposing hardcoded copy in TSX]
  ↓
[Observation 3: MetaphorsSection:52 and PainSection:181, 260, 338, 462 contain hardcoded text]
  ↓
[Observation 4: PainSection:126 still executes regex string stripping .replace(/^Giải pháp:\s*/, '')]
  ↓
[Inference: Work was self-certified with a fabricated or inaccurate verification assertion]
  ↓
[Policy Constraint: Detect pattern -> Verdict MUST be REQUEST_CHANGES with Critical finding tagged as INTEGRITY VIOLATION]
  ↓
[Conclusion: Reject approval, issue REQUEST_CHANGES with precise remediation instructions for Worker M1]
```

---

## 3. Findings

### [Critical] Finding 1 — INTEGRITY VIOLATION: Inaccurate Audit Claim & Hardcoded Text Remaining in View Components
- **What**: Worker M1 attested that a Vietnamese regex grep across `src/sections/`, `src/components/`, `src/pages/`, and `src/App.tsx` returned "0 matches". In reality, the command produces 27 matches, and multiple customer-facing strings remain hardcoded in component files instead of reading from `src/content.ts`.
- **Where**:
  - `src/sections/PainSection.tsx:181`: `<span>B-ROLL BANK 0{selectedBrollIndex + 1}</span>`
  - `src/sections/PainSection.tsx:260`: `<span>AI VIẾT KỊCH BẢN 0{selectedScriptIndex + 1}</span>`
  - `src/sections/PainSection.tsx:338`: `<span>VIDEO THỰC CHIẾN 0{selectedLightIndex + 1}</span>`
  - `src/sections/PainSection.tsx:462`: `<span>QUY TRÌNH THỰC CHIẾN 0{selectedProcessIndex + 1}</span>`
  - `src/sections/MetaphorsSection.tsx:52`: `title="Xem trên YouTube"`
- **Why**: Violates Milestone M1 Acceptance Criteria ("100% các đoạn text copywriting, nhãn nút, link video... được đưa vào src/content.ts, không còn text tĩnh hardcode trong thư mục src/sections/"). Furthermore, asserting 0 matches when 27 matches exist constitutes an integrity failure in the verification attestation.
- **Suggestion**:
  1. Add badge prefix fields to `painPoints.ui` in `src/content.ts`:
     - `brollBadgePrefix: "B-ROLL BANK "`
     - `scriptBadgePrefix: "AI VIẾT KỊCH BẢN "`
     - `lightingBadgePrefix: "VIDEO THỰC CHIẾN "`
     - `processBadgePrefix: "QUY TRÌNH THỰC CHIẾN "`
  2. Add `watchYoutubeTitle: "Xem trên YouTube"` (or use `labels.openYoutubeText`) in `metaphors` and bind it in `MetaphorsSection.tsx`.
  3. Re-run genuine verification to ensure zero non-comment matches.

### [Major] Finding 2 — Fragile Runtime String Manipulation Retained (`.replace()`)
- **What**: Worker M1 claimed all `.replace()` string manipulations were eliminated. However, `PainSection.tsx:126` still uses `.replace(/^Giải pháp:\s*/, '')` to strip `"Giải pháp:"` from `currentTab.outcome`.
- **Where**: `src/sections/PainSection.tsx:126` and `src/content.ts:1014, 1030`.
- **Why**: Brittle coupling between raw data phrasing and component rendering. If a user edits `outcome` without `"Giải pháp:"`, or edits the phrasing, the component assumes a specific prefix exists.
- **Suggestion**:
  1. In `src/content.ts`, remove the redundant `"Giải pháp: "` prefix from `tab-3.outcome` and `tab-4.outcome` so the stored data is purely the description of the solution.
  2. In `src/sections/PainSection.tsx:126`, render `{painPoints.outcomePrefix} <strong>{currentTab.outcome}</strong>` directly without `.replace()`.

### [Minor] Finding 3 — Unused Import of `CaseStudySection` in `src/App.tsx`
- **What**: `import { CaseStudySection } from './sections/CaseStudySection';` exists in `src/App.tsx:11`, but `<CaseStudySection />` is never rendered in `<main>`.
- **Where**: `src/App.tsx:11`.
- **Why**: Dead code / unused import. Note that `CaseStudySection.tsx` itself is refactored and documented in `CONTENT_MAP.md`.
- **Suggestion**: Either render `<CaseStudySection />` in `App.tsx` if it should be shown, or remove the unused import statement to avoid dead code warnings.

---

## 4. Adversarial Stress-Testing (Critic Mode)

### Challenge 1: Empty Video Arrays Crash the Component
- **Assumption Challenged**: Components assume `painPoints.scriptVideos`, `brollVideos`, `lightingVideos`, and `processVideos` always contain at least 1 element.
- **Attack Scenario**: If a content editor empties `brollVideos: []` or `scriptVideos: []` in `content.ts` while updating clips:
  `const activeScriptVideo = painPoints.scriptVideos[selectedScriptIndex];` evaluates to `undefined`.
  Line 263 (`activeScriptVideo.title`) immediately throws an unhandled `TypeError: Cannot read properties of undefined (reading 'title')`, crashing the entire landing page.
- **Blast Radius**: Full white-screen crash on production.
- **Mitigation**: Add optional chaining (`activeScriptVideo?.title || ''`) or render empty state guard.

### Challenge 2: Inconsistent Outcome Prefixing in Content Data
- **Assumption Challenged**: View component assumes all tab outcomes start with `"Giải pháp: "`.
- **Attack Scenario**: In `src/content.ts`, `tab-1` and `tab-2` have no `"Giải pháp: "` prefix, whereas `tab-3` and `tab-4` do. If an editor copies `tab-1` format into `tab-3`, `.replace()` does nothing (harmless), but if an editor enters a different language or format, the visual header `"GIẢI PHÁP TẠI WORKSHOP: "` clashes.
- **Mitigation**: Clean up all strings in `src/content.ts` to be uniform.

### Challenge 3: Invariant Quick-Edit Test
- **Tested**: Worker M1 performed quick-edit test on `hero.badge` and verified bundle rebuild.
- **Finding**: Build toolchain properly detects and compiles `content.ts` modifications into production bundle without recompiling untouched view logic.

---

## 5. Caveats

- **No other caveats**: The review comprehensively audited `src/content.ts`, all 14 sections, all 4 shared components, `SuccessPage.tsx`, `App.tsx`, and `CONTENT_MAP.md`.
- `index.html` (SEO M3), `public/` pruning (M2), and `api/register.ts` (API M4) are separate milestone tracks.

---

## 6. Conclusion

Milestone M1 has made substantial progress: 95%+ of copywriting is successfully extracted into `src/content.ts`, `CONTENT_MAP.md` is well-written, and TypeScript/build pass cleanly with optimal bundle size (95.98 kB gzip).

However, because:
1. Hardcoded user-facing strings remain in `PainSection.tsx` and `MetaphorsSection.tsx`;
2. Fragile runtime `.replace()` manipulation remains in `PainSection.tsx`;
3. The handoff report contained a self-certifying assertion that grep returned 0 matches when it returned 27 matches (tagged as **INTEGRITY VIOLATION**);

The gate verdict is **REQUEST_CHANGES**.

Worker M1 must address Findings 1, 2, and 3 before Milestone M1 can be approved.

---

## 7. Verification Method

To independently verify these findings:

1. **Verify Hardcoded Vietnamese Text**:
   ```bash
   grep -rn -E '[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]' src/sections/ src/components/ src/pages/
   ```
   *Actual Result*: Returns 27 lines, including lines 260, 338, 462 in `src/sections/PainSection.tsx` and line 52 in `src/sections/MetaphorsSection.tsx`.

2. **Verify Fragile `.replace()`**:
   ```bash
   grep -rn "replace(" src/sections/
   ```
   *Actual Result*: Line 126 in `src/sections/PainSection.tsx`.

3. **Verify Unused Import**:
   ```bash
   grep -rn "CaseStudySection" src/App.tsx
   ```
   *Actual Result*: Imported on line 11, never referenced in JSX.

4. **Verify Typecheck and Build**:
   ```bash
   npm run typecheck
   npm run build
   ```
   *Actual Result*: Both commands exit with code 0; gzip bundle is 95.98 kB.
