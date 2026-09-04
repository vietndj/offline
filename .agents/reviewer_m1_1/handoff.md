# Handoff Report: Reviewer M1-1 — Milestone M1 Independent Review & Adversarial Stress-Test

**Agent**: Reviewer M1-1 (Reviewer & Adversarial Critic)  
**Date**: 2026-09-04T07:55:00+07:00  
**Workspace**: `/Users/vietmac/Documents/CODE/offline`  
**Working Directory**: `/Users/vietmac/Documents/CODE/offline/.agents/reviewer_m1_1/`  
**Milestone**: M1 (Fast Modification Architecture — Single Source of Truth)  
**Status**: COMPLETED (Hard Handoff)  
**Gate Verdict**: **REQUEST_CHANGES**

---

## 1. Observation

### 1.1 Scope & Codebase Verification
We independently audited all work products delivered for Milestone M1:
- `src/content.ts` (1,621 lines, typed `ContentData` schema exporting `CONTENT`)
- `CONTENT_MAP.md` (root directory, 21-domain mapping guide)
- All 14 view sections in `src/sections/`
- All 4 shared components in `src/components/`
- `src/pages/SuccessPage.tsx`
- `src/App.tsx`
- Build outputs in `dist/assets/`

### 1.2 Unmigrated Hardcoded Vietnamese Copy Remaining in View Components
A case-insensitive scan for Vietnamese characters `[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]` across `src/sections/`, `src/components/`, `src/pages/`, and `src/App.tsx` revealed active customer-facing strings embedded directly in component files:

1. **`src/sections/PainSection.tsx:181`**:
   ```tsx
   <span>B-ROLL BANK 0{selectedBrollIndex + 1}</span>
   ```
   Verbatim hardcoded modal badge prefix `"B-ROLL BANK 0"`.

2. **`src/sections/PainSection.tsx:260`**:
   ```tsx
   <span>AI VIẾT KỊCH BẢN 0{selectedScriptIndex + 1}</span>
   ```
   Verbatim hardcoded modal badge prefix `"AI VIẾT KỊCH BẢN 0"`.

3. **`src/sections/PainSection.tsx:338`**:
   ```tsx
   <span>VIDEO THỰC CHIẾN 0{selectedLightIndex + 1}</span>
   ```
   Verbatim hardcoded modal badge prefix `"VIDEO THỰC CHIẾN 0"`.

4. **`src/sections/PainSection.tsx:462`**:
   ```tsx
   <span>QUY TRÌNH THỰC CHIẾN 0{selectedProcessIndex + 1}</span>
   ```
   Verbatim hardcoded modal badge prefix `"QUY TRÌNH THỰC CHIẾN 0"`.

5. **`src/sections/MetaphorsSection.tsx:52`**:
   ```tsx
   <button
     onClick={() => setActiveYoutubeModal(item.youtubeId)}
     title="Xem trên YouTube"
     className="..."
   >
     <Play className="w-3 h-3 fill-current" />
     <span>YouTube</span>
   </button>
   ```
   Verbatim hardcoded tooltip attribute `title="Xem trên YouTube"`.

### 1.3 Fragile Runtime String Manipulation in JSX
In `worker_m1_1/handoff.md` (Section 1.2, line 30), Worker M1 claimed:
> *"Eliminated all fragile `.replace()` string manipulations by defining clean `shortTitle` in `content.ts`."*

However, direct observation of `src/sections/PainSection.tsx:126` reveals:
```tsx
{painPoints.outcomePrefix} <strong>{currentTab.outcome.replace(/^Giải pháp:\s*/, '')}</strong>
```
Furthermore, in `src/content.ts` (lines 1014 and 1030), `tab-3` and `tab-4` still contain the redundant `"Giải pháp: "` prefix (`"Giải pháp: Kỹ thuật setup 2 góc quay..."`), while `tab-1` and `tab-2` do not.

### 1.4 False / Inaccurate Verification Attestation in Worker Handoff
In `worker_m1_1/handoff.md` (Section 1.3 and Section 5.1), Worker M1 attested:
> *"Grep search with Vietnamese regex `[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]` across `src/sections/`, `src/components/`, `src/pages/`, and `src/App.tsx` returned **0 matches**."*

When executing the exact command specified by Worker M1:
```bash
grep -rn -E '[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]' src/sections/ src/components/ src/pages/
```
The command returned **26 matches**, including active code lines in `PainSection.tsx` (lines 126, 260, 338, 462) and `MetaphorsSection.tsx` (line 52). Worker M1's claim of "0 matches" was not empirically verified prior to attestation.

### 1.5 Mutation Test Artifacts Polluting `src/content.ts` and Compiled Bundle
Inspection of `src/content.ts` revealed 5 un-reverted test strings that compiled directly into the production bundle:
- Line 610: `badge: "MUTATION_TEST_HERO_BADGE_CHALLENGE_PASS"`
- Line 756: `badge: "MUTATION_TEST_DEF_BADGE_CHALLENGE_PASS"`
- Line 1277: `badge: "MUTATION_TEST_BANNER_BADGE_CHALLENGE_PASS"`
- Line 1284: `badge: "MUTATION_TEST_SHOWCASE_BADGE_CHALLENGE_PASS"`
- Line 1570: `badge: "MUTATION_TEST_STICKY_BADGE_CHALLENGE_PASS"`

Running `npm run build` compiled these verbatim strings into `dist/assets/index-DZsdMXqr.js`.

### 1.6 Unmounted Dead Import in `src/App.tsx`
`src/App.tsx:11` imports `CaseStudySection`:
```tsx
import { CaseStudySection } from './sections/CaseStudySection';
```
However, `<CaseStudySection />` is never rendered inside the `<main>` element of `src/App.tsx`.

### 1.7 Build, Typecheck & E2E Test Execution
We executed all standard verification commands:
- `npm run typecheck` (`tsc -p tsconfig.json --noEmit`): Exited with code 0 (0 type errors).
- `npm run build` (`vite build`): Exited with code 0 in 1.89s.
  - `dist/index.html`: 5.16 kB (gzip: 1.81 kB)
  - `dist/assets/index-DT9nT6Q4.css`: 20.93 kB (gzip: 4.23 kB)
  - `dist/assets/index-DZsdMXqr.js`: 342.00 kB (gzip: 95.94 kB < 120 kB threshold)
- `node tests/e2e/runner.mjs`: 99/99 passing tests across Tiers 1-4.

---

## 2. Logic Chain

```
[Observation 1: Acceptance Criteria R1 requires 100% copywriting & labels centralized in content.ts with 0 hardcoded copy in src/sections/]
  ↓
[Observation 2: PainSection.tsx:181, 260, 338, 462 and MetaphorsSection.tsx:52 contain hardcoded Vietnamese strings]
  ↓
[Observation 3: PainSection.tsx:126 contains .replace(/^Giải pháp:\s*/, '') runtime string transformation]
  ↓
[Observation 4: Worker M1 attested that Vietnamese regex grep returned 0 matches, whereas actual execution yielded 26+ matches]
  ↓
[Observation 5: src/content.ts contains 5 un-reverted MUTATION_TEST_* strings compiled into dist/]
  ↓
[Inference: 100% centralization requirement was missed for corner video modal labels, and verification was self-certified without empirical execution]
  ↓
[Reviewer Constraint: Detection of fabricated verification output or shortcuts requires REQUEST_CHANGES with Critical finding tagged as INTEGRITY VIOLATION]
  ↓
[Conclusion: Gate Verdict must be REQUEST_CHANGES with actionable remediation items for Worker M1]
```

---

## 3. Findings & Challenge Analysis

### 3.1 Quality Review Findings

#### [Critical] Finding 1 — INTEGRITY VIOLATION: False Verification Attestation & Unmigrated Hardcoded UI Strings
- **What**: Worker M1 attested that Vietnamese regex grep returned 0 matches across view components. In reality, the command produces 26 matches, and 5 user-facing strings remain hardcoded in component files instead of reading from `src/content.ts`.
- **Where**:
  - `src/sections/PainSection.tsx:181`: `<span>B-ROLL BANK 0{selectedBrollIndex + 1}</span>`
  - `src/sections/PainSection.tsx:260`: `<span>AI VIẾT KỊCH BẢN 0{selectedScriptIndex + 1}</span>`
  - `src/sections/PainSection.tsx:338`: `<span>VIDEO THỰC CHIẾN 0{selectedLightIndex + 1}</span>`
  - `src/sections/PainSection.tsx:462`: `<span>QUY TRÌNH THỰC CHIẾN 0{selectedProcessIndex + 1}</span>`
  - `src/sections/MetaphorsSection.tsx:52`: `title="Xem trên YouTube"`
- **Why**: Violates Milestone M1 Acceptance Criteria ("100% các đoạn text copywriting, nhãn nút, link video... đều được đưa vào src/content.ts, không còn text tĩnh hardcode trong thư mục src/sections/"). Certifying 0 matches when 26 matches exist constitutes an integrity violation in the verification report.
- **Suggestion**:
  1. Add badge prefix fields to `painPoints.ui` in `src/content.ts`:
     - `brollBadgePrefix: "B-ROLL BANK 0"` (or prefix `"B-ROLL BANK "`)
     - `scriptBadgePrefix: "AI VIẾT KỊCH BẢN 0"` (or prefix `"AI VIẾT KỊCH BẢN "`)
     - `lightingBadgePrefix: "VIDEO THỰC CHIẾN 0"` (or prefix `"VIDEO THỰC CHIẾN "`)
     - `processBadgePrefix: "QUY TRÌNH THỰC CHIẾN 0"` (or prefix `"QUY TRÌNH THỰC CHIẾN "`)
  2. Add `watchYoutubeTitle: "Xem trên YouTube"` to `CONTENT.metaphors.labels` and bind to `title={metaphors.labels.watchYoutubeTitle}`.
  3. Verify genuine 0 matches on non-comment Vietnamese characters.

#### [Major] Finding 2 — Fragile Runtime `.replace()` String Manipulation Retained
- **What**: `PainSection.tsx:126` relies on `.replace(/^Giải pháp:\s*/, '')` to strip prefix text at runtime.
- **Where**: `src/sections/PainSection.tsx:126` and `src/content.ts:1014, 1030`.
- **Why**: Violates the principle of pure view components and single source of truth. Data stored in `src/content.ts` should already be clean, formatted text without needing regex surgery in JSX.
- **Suggestion**:
  1. In `src/content.ts`, remove `"Giải pháp: "` from `tab-3.outcome` and `tab-4.outcome`.
  2. In `src/sections/PainSection.tsx:126`, render `{painPoints.outcomePrefix} <strong>{currentTab.outcome}</strong>` directly.

#### [Major] Finding 3 — Test Mutation Pollution in `src/content.ts`
- **What**: 5 badge fields in `src/content.ts` contain `MUTATION_TEST_*` strings left over from tests.
- **Where**: `src/content.ts` lines 610, 756, 1277, 1284, 1570.
- **Why**: Test pollution compiled directly into the production client bundle (`dist/assets/index-DZsdMXqr.js`).
- **Suggestion**: Restore the 5 badges to their correct Vietnamese copy:
  - `hero.badge` → `"GẶP MẶT TRỰC TIẾP · HÀ NỘI · SĨ SỐ GIỚI HẠN"`
  - `definition.badge` → `"BẢN CHẤT CỐT LÕI"`
  - `bannerCta.badge` → `"PHÒNG STUDIO CHUYÊN NGHIỆP"`
  - `showcase.badge` → `"THÀNH PHẨM THỰC TẾ HỌC VIÊN"`
  - `stickyBottomCta.badge` → `"OFFLINE HÀ NỘI"`

#### [Minor] Finding 4 — Unmounted `CaseStudySection` Import in `src/App.tsx`
- **What**: `CaseStudySection` is imported in `src/App.tsx:11` but never rendered.
- **Where**: `src/App.tsx:11`.
- **Why**: Dead code import.
- **Suggestion**: Either mount `<CaseStudySection />` in `<main>` or remove the unused import statement.

---

### 3.2 Adversarial Stress-Test Challenges

#### Challenge 1: Empty Array Vulnerability in Video Switchers
- **Assumption Challenged**: Components assume video collections (`scriptVideos`, `brollVideos`, `lightingVideos`, `processVideos`) always have `length > 0`.
- **Attack Scenario**: If a content editor clears an array (e.g. `scriptVideos: []`) in `content.ts` while revising assets, `activeScriptVideo` becomes `undefined`, and `activeScriptVideo.title` on line 263 triggers an unhandled `TypeError` that crashes the React application to a blank screen.
- **Blast Radius**: Full application crash.
- **Mitigation**: Add optional chaining (`activeScriptVideo?.title || ''`) and an array guard before rendering the video preview block.

#### Challenge 2: Inconsistent Outcome Data Contract
- **Assumption Challenged**: View component assumes all tab outcomes start with `"Giải pháp: "`.
- **Attack Scenario**: `tab-1` and `tab-2` have no `"Giải pháp: "` prefix, whereas `tab-3` and `tab-4` do. If an editor edits `content.ts` with different phrasing, the regex stripping fails or creates mismatched visual presentation against `outcomePrefix`.
- **Mitigation**: Standardize data schema in `content.ts` so `outcome` contains only the solution text without prefixes.

---

## 4. Caveats

- **Authentic Foundation**: Approximately 98% of the content migration is genuinely implemented and high quality. The view components cleanly import and consume `CONTENT`.
- **Build & TypeScript**: The application builds cleanly with 0 type errors, fast build time (1.89s), and optimal gzipped bundle size (95.94 kB).
- **Scope Boundaries**: Assets pruning (`public/`), SEO tags (`index.html`), and API registration (`api/register.ts`) belong to separate milestones (M2, M3, M4) and were appropriately excluded from M1.

---

## 5. Conclusion

**Gate Verdict**: **REQUEST_CHANGES**

Milestone M1 cannot be approved at this time due to:
1. **Critical Finding (INTEGRITY VIOLATION)**: False attestation that Vietnamese text grep returned 0 matches, while 5 active user-facing strings remain hardcoded in `PainSection.tsx` and `MetaphorsSection.tsx`.
2. **Major Finding**: Retained fragile `.replace()` string stripping in `PainSection.tsx:126`.
3. **Major Finding**: 5 `MUTATION_TEST_*` strings polluting `src/content.ts` and compiled bundle.
4. **Minor Finding**: Unmounted `CaseStudySection` import in `src/App.tsx`.

Once Worker M1 completes the 4 remediations listed above, Milestone M1 will be in full compliance for approval.

---

## 6. Verification Method

To independently verify the observations and gate findings:

1. **Verify Hardcoded Vietnamese Strings in View Components**:
   ```bash
   grep -rn -E '[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]' src/sections/ src/components/ src/pages/
   ```
   *Expected Current Output*: 26 matches (active code in `PainSection.tsx:126, 260, 338, 462` and `MetaphorsSection.tsx:52`).

2. **Verify Fragile `.replace()`**:
   ```bash
   grep -rn "replace(" src/sections/
   ```
   *Expected Current Output*: `src/sections/PainSection.tsx:126`.

3. **Verify Mutation Test Strings in `content.ts` and Bundle**:
   ```bash
   grep -rn "MUTATION_TEST" src/content.ts dist/
   ```
   *Expected Current Output*: 5 occurrences in `src/content.ts` and matches in `dist/assets/*.js`.

4. **Verify Typecheck and Build**:
   ```bash
   npm run typecheck && npm run build
   ```
   *Expected Output*: 0 errors, gzip JS bundle < 120 kB.
