# Handoff Report: Challenger M1-1 — Empirical Challenge of Milestone M1

**Agent**: Challenger M1-1 (Empirical Challenger, Critic, Specialist)  
**Date**: 2026-09-04T07:55:00+07:00  
**Workspace**: `/Users/vietmac/Documents/CODE/offline`  
**Milestone**: M1 (Fast Modification Architecture - Single Source of Truth)  
**Gate Verdict**: **`CHALLENGE_FOUND`**  

---

## 1. Observation

### 1.1 Empirical Quick Edit Mutation Test
We executed an automated programmatical mutation test targeting 5 distinct fields across 5 separate sections in `src/content.ts`:
1. `hero.badge`: `"GẶP MẶT TRỰC TIẾP · HÀ NỘI · SĨ SỐ GIỚI HẠN"` → `"MUTATION_TEST_HERO_BADGE_CHALLENGE_PASS"`
2. `definition.badge`: `"BẢN CHẤT CỐT LÕI · PHÂN BIỆT RÕ RÀNG"` → `"MUTATION_TEST_DEF_BADGE_CHALLENGE_PASS"`
3. `bannerCta.badge`: `"PHÒNG STUDIO CHUYÊN NGHIỆP"` → `"MUTATION_TEST_BANNER_BADGE_CHALLENGE_PASS"`
4. `showcase.badge`: `"THÀNH PHẨM THỰC TẾ HỌC VIÊN"` → `"MUTATION_TEST_SHOWCASE_BADGE_CHALLENGE_PASS"`
5. `stickyBottomCta.badge`: `"OFFLINE HÀ NỘI"` → `"MUTATION_TEST_STICKY_BADGE_CHALLENGE_PASS"`

Command executed:
```bash
node -e '...' # applied mutations to src/content.ts, verified git status in src/ (only content.ts modified), executed npm run build, checked dist/assets/*.js, restored content.ts and rebuilt
```

**Results observed directly in `dist/assets/index-DZsdMXqr.js`**:
```json
{
  "heroBadge": {
    "token": "MUTATION_TEST_HERO_BADGE_CHALLENGE_PASS",
    "file": "index-DZsdMXqr.js",
    "found": true
  },
  "defBadge": {
    "token": "MUTATION_TEST_DEF_BADGE_CHALLENGE_PASS",
    "file": "index-DZsdMXqr.js",
    "found": true
  },
  "bannerBadge": {
    "token": "MUTATION_TEST_BANNER_BADGE_CHALLENGE_PASS",
    "file": "index-DZsdMXqr.js",
    "found": true
  },
  "showcaseBadge": {
    "token": "MUTATION_TEST_SHOWCASE_BADGE_CHALLENGE_PASS",
    "file": "index-DZsdMXqr.js",
    "found": true
  },
  "stickyBadge": {
    "token": "MUTATION_TEST_STICKY_BADGE_CHALLENGE_PASS",
    "file": "index-DZsdMXqr.js",
    "found": true
  }
}
```
All 5 mutated tokens were compiled directly into the production client bundle with **0 component modifications**. After testing, `src/content.ts` was cleanly restored and verified (`git diff src/content.ts` returned 0 differences).

---

### 1.2 Adversarial String Scan (Discovered Hardcoded Copy)
We performed an exhaustive line-by-line inspection across all 21 `.tsx` files in `src/` using a case-insensitive Vietnamese character matcher:
```javascript
/[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i
```

**Direct Observations**:
1. **`src/sections/PainSection.tsx` (Line 260)**:
   ```tsx
   258: <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500 text-zinc-950 font-mono text-[11px] font-bold uppercase mb-1.5 shadow-sm">
   259:   <Video className="w-3.5 h-3.5" />
   260:   <span>AI VIẾT KỊCH BẢN 0{selectedScriptIndex + 1}</span>
   261: </div>
   ```
   Contains hardcoded Vietnamese text: `"AI VIẾT KỊCH BẢN"`.

2. **`src/sections/PainSection.tsx` (Line 338)**:
   ```tsx
   336: <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500 text-zinc-950 font-mono text-[11px] font-bold uppercase mb-1.5 shadow-sm">
   337:   <Video className="w-3.5 h-3.5" />
   338:   <span>VIDEO THỰC CHIẾN 0{selectedLightIndex + 1}</span>
   339: </div>
   ```
   Contains hardcoded Vietnamese text: `"VIDEO THỰC CHIẾN"`.

3. **`src/sections/PainSection.tsx` (Line 462)**:
   ```tsx
   460: <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500 text-zinc-950 font-mono text-[11px] font-bold uppercase mb-1.5 shadow-sm">
   461:   <Video className="w-3.5 h-3.5" />
   462:   <span>QUY TRÌNH THỰC CHIẾN 0{selectedProcessIndex + 1}</span>
   463: </div>
   ```
   Contains hardcoded Vietnamese text: `"QUY TRÌNH THỰC CHIẾN"`.
   *(Note: Line 181 also hardcodes `<span>B-ROLL BANK 0{selectedBrollIndex + 1}</span>`)*.

4. **`src/sections/MetaphorsSection.tsx` (Line 52)**:
   ```tsx
   50: <button
   51:   onClick={() => setActiveYoutubeModal(item.youtubeId)}
   52:   title="Xem trên YouTube"
   53:   className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 hover:bg-red-600 text-white text-[11px] font-mono font-semibold backdrop-blur-md border border-white/20 transition-colors shadow-sm cursor-pointer"
   54: >
   ```
   Contains hardcoded Vietnamese tooltip text: `title="Xem trên YouTube"`.

5. **`src/sections/PainSection.tsx` (Line 126)**:
   ```tsx
   125: <div className="p-5 sm:p-6 rounded-2xl border-2 border-emerald-500/40 bg-emerald-950/40 text-emerald-100 text-base sm:text-lg font-sans mb-6 leading-relaxed shadow-lg">
   126:   {painPoints.outcomePrefix} <strong>{currentTab.outcome.replace(/^Giải pháp:\s*/, '')}</strong>
   127: </div>
   ```
   Contains hardcoded string manipulation regex `.replace(/^Giải pháp:\s*/, '')`.

---

### 1.3 Audit of Worker M1 Claims vs Reality
In `.agents/worker_m1_1/handoff.md`, Worker M1 reported:
> *"3. Zero Hardcoded Text Audit: Grep search with Vietnamese regex `[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]` across `src/sections/`, `src/components/`, `src/pages/`, and `src/App.tsx` returned 0 matches."*

**Flaw in worker's verification**:
- The worker's audit regex was **strictly lowercase**: `[àáảãạ...]`.
- Words in all-caps uppercase (`AI VIẾT KỊCH BẢN`, `VIDEO THỰC CHIẾN`, `QUY TRÌNH THỰC CHIẾN`) use Unicode code points `Ế (\u1EBE)`, `Ị (\u1ECB)`, `Ả (\u1EA2)`, `Ự (\u1EF0)`, `Ì (\u00CC)`. None of these match lowercase ranges.
- Furthermore, `src/content.ts` lines 1160–1163 ALREADY defines:
  ```typescript
  ui: {
    brollCategory: "Kho B-Roll Bank Xử Lý",
    scriptCategory: "Trợ Lý AI Viết Kịch Bản Thực Chiến",
    lightingCategory: "Thực Hành Setup Ánh Sáng",
    processCategory: "Quy Trình Sản Xuất 1 Buổi/Tuần",
    ...
  }
  ```
  However, `PainSection.tsx` never consumed these fields for the video card badges, leaving static hardcoded labels instead.

---

## 2. Logic Chain

1. **Premise (R1 Contract & Acceptance Criteria)**:
   - `ORIGINAL_REQUEST.md`: *"100% các đoạn text copywriting, nhãn nút, link video, số liệu thống kê đều được đưa vào `src/content.ts`, không còn text tĩnh hardcode trong thư mục `src/sections/`."*
   - `PROJECT.md`: *"View components must NOT define any hardcoded copy, string literals for user-facing text, or hardcoded media URLs. All text/media must be accessed via `CONTENT.<section>.<field>`."*

2. **Observation Step 1**:
   - Programmatic Quick Edit on 5 badge fields (`hero`, `definition`, `bannerCta`, `showcase`, `stickyBottomCta`) verified that changes in `src/content.ts` propagate cleanly into `dist/assets/index-DZsdMXqr.js` (Section 1.1).

3. **Observation Step 2**:
   - Case-insensitive string scan identified 5 instances of hardcoded Vietnamese text and regex manipulation in `src/sections/PainSection.tsx` (lines 126, 260, 338, 462) and `src/sections/MetaphorsSection.tsx` (line 52) (Section 1.2).

4. **Inference**:
   - If an editor changes `painPoints.ui.scriptCategory` in `src/content.ts`, the UI badge at line 260 of `PainSection.tsx` will NOT reflect the change.
   - If an editor translates or renames the tooltip for the YouTube button in `MetaphorsSection`, they cannot do so in `src/content.ts` because it is hardcoded as `title="Xem trên YouTube"`.
   - If an editor changes the outcome copy format in `content.ts`, `.replace(/^Giải pháp:\s*/, '')` in `PainSection.tsx:126` will break or fail to strip prefixes correctly.

5. **Conclusion**:
   - While the architecture for Quick Edit is ~98% functional and passes TypeScript typecheck and Vite build, Milestone M1 strictly mandates **100% centralization and zero hardcoded copy in `src/sections/`**.
   - Therefore, a challenge is raised: gate verdict is **`CHALLENGE_FOUND`**.

---

## 3. Caveats

- **Scope boundary**: Challenger operates under strict read/test constraints and does not directly alter source code.
- **Components outside `src/sections/`**: `src/components/`, `src/pages/`, and `src/App.tsx` were also scanned and found to have **0** hardcoded Vietnamese strings. The issue is isolated specifically to `PainSection.tsx` and `MetaphorsSection.tsx`.
- **E2E Test Suite**: All 99 active tests in `npm run test:e2e` pass. The existing E2E tests check for specific strings from `content.ts` but did not have an adversarial check for uppercase Vietnamese string literals in TSX files.

---

## 4. Conclusion & Recommended Fix

### Gate Verdict: **`CHALLENGE_FOUND`**

### Actionable Remediation for Worker M1:
1. **`src/sections/MetaphorsSection.tsx` (Line 52)**:
   - In `src/content.ts`, add to `metaphors`: `watchYoutubeTitle: "Xem trên YouTube"` (or add to `ui` sub-object).
   - In `MetaphorsSection.tsx:52`, change `title="Xem trên YouTube"` to `title={metaphors.watchYoutubeTitle || "Xem trên YouTube"}`.

2. **`src/sections/PainSection.tsx` (Lines 181, 260, 338, 462)**:
   - Line 181: Replace `<span>B-ROLL BANK 0{selectedBrollIndex + 1}</span>` with:
     ```tsx
     <span>{painPoints.ui.brollBadgePrefix || "B-ROLL BANK"} 0{selectedBrollIndex + 1}</span>
     ```
   - Line 260: Replace `<span>AI VIẾT KỊCH BẢN 0{selectedScriptIndex + 1}</span>` with:
     ```tsx
     <span>{painPoints.ui.scriptBadgePrefix || "AI VIẾT KỊCH BẢN"} 0{selectedScriptIndex + 1}</span>
     ```
   - Line 338: Replace `<span>VIDEO THỰC CHIẾN 0{selectedLightIndex + 1}</span>` with:
     ```tsx
     <span>{painPoints.ui.lightingBadgePrefix || "VIDEO THỰC CHIẾN"} 0{selectedLightIndex + 1}</span>
     ```
   - Line 462: Replace `<span>QUY TRÌNH THỰC CHIẾN 0{selectedProcessIndex + 1}</span>` with:
     ```tsx
     <span>{painPoints.ui.processBadgePrefix || "QUY TRÌNH THỰC CHIẾN"} 0{selectedProcessIndex + 1}</span>
     ```
   *(Ensure corresponding keys exist in `ContentData.painPoints.ui` in `src/content.ts`)*.

3. **`src/sections/PainSection.tsx` (Line 126)**:
   - Remove `.replace(/^Giải pháp:\s*/, '')` from JSX. In `src/content.ts`, ensure `currentTab.outcome` values already contain clean text without the `"Giải pháp: "` prefix, or provide a separate `solutionText` property.

---

## 5. Verification Method

To independently reproduce and verify these findings:

1. **Run the Case-Insensitive Vietnamese Scan**:
   ```bash
   node -e '
   const fs = require("fs");
   const files = ["src/sections/MetaphorsSection.tsx", "src/sections/PainSection.tsx"];
   const regex = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
   files.forEach(f => {
     const lines = fs.readFileSync(f, "utf8").split("\n");
     lines.forEach((l, i) => {
       if (regex.test(l.replace(/\/\/.*$/, "").replace(/\{\/\*.*?\*\/\}/g, ""))) {
         console.log(`${f}:${i+1}: ${l.trim()}`);
       }
     });
   });
   '
   ```
   *Expected Output*: Displays lines 52 in `MetaphorsSection.tsx` and lines 126, 260, 338, 462 in `PainSection.tsx`.

2. **Run the 5-Field Quick Edit Mutation Test**:
   ```bash
   node -e '
   const fs = require("fs");
   const { execSync } = require("child_process");
   const content = fs.readFileSync("src/content.ts", "utf8");
   const testBadge = "MUTATION_VERIFICATION_GATE_TEST";
   fs.writeFileSync("src/content.ts", content.replace(`badge: "GẶP MẶT TRỰC TIẾP · HÀ NỘI · SĨ SỐ GIỚI HẠN",`, `badge: "${testBadge}",`));
   execSync("npm run build");
   const dist = fs.readFileSync(fs.readdirSync("dist/assets").filter(f => f.startsWith("index-") && f.endsWith(".js")).map(f => "dist/assets/" + f)[0], "utf8");
   console.log("Token in bundle:", dist.includes(testBadge));
   fs.writeFileSync("src/content.ts", content);
   execSync("npm run build");
   '
   ```
   *Expected Output*: `Token in bundle: true`.
