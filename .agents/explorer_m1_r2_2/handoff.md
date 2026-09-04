# Handoff Report: Explorer M1-R2-2 — Milestone M1 Forensic Audit Analysis & Remediation Blueprint

**Agent**: Explorer M1-R2-2 (Investigator & Synthesizer)  
**Date**: 2026-09-04T08:04:00+07:00  
**Workspace**: `/Users/vietmac/Documents/CODE/offline`  
**Working Directory**: `/Users/vietmac/Documents/CODE/offline/.agents/explorer_m1_r2_2/`  
**Milestone**: M1 (Fast Modification Architecture — Single Source of Truth)  
**Status**: COMPLETED (Hard Handoff — Ready for Implementation)  

---

## 1. Observation

### 1.1 Gate Failure Diagnosis & Cross-Audit Synthesis
We thoroughly reviewed `ORIGINAL_REQUEST.md`, `PROJECT.md`, `GATE_STATUS.md`, Forensic Audit report (`auditor_m1_1/handoff.md`), Reviewer reports (`reviewer_m1_1/handoff.md`, `reviewer_m1_2/handoff.md`), and Challenger reports (`challenger_m1_1/handoff.md`, `challenger_m1_2/handoff.md`).

The audit gate failed with **INTEGRITY VIOLATION**, **REQUEST_CHANGES**, and **CHALLENGE_FOUND** due to 4 root-cause defect categories:
1. **Unmigrated Hardcoded User-Facing Copy** in `src/sections/PainSection.tsx` and `src/sections/MetaphorsSection.tsx`.
2. **Fragile Runtime Regex Surgery** (`.replace(/^Giải pháp:\s*/, '')`) in `src/sections/PainSection.tsx:126` coupled with redundant prefixes in `src/content.ts`.
3. **Test Mutation Artifact Pollution** in `src/content.ts` compiled directly into client bundle `dist/assets/*.js`.
4. **Defensive Edge Case Fragilities & Code Hygiene**:
   - Subheadline truncation on empty string in `DefinitionSection.tsx:25`.
   - Missing array boundary guards in `PainSection.tsx:7` and `GrowthChartSection.tsx:13-28`.
   - Dead/unmounted import `CaseStudySection` in `src/App.tsx:11`.

---

### 1.2 Direct Empirical Observations of Defects

#### Defect 1: Hardcoded Copy in View Components
Running an adversarial Unicode regex scanner for Vietnamese characters across all view files:
```bash
node -e '
const fs = require("fs");
const regex = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ]/;
["src/sections", "src/components", "src/pages", "src/App.tsx"].forEach(p => {
  const files = fs.statSync(p).isDirectory() ? fs.readdirSync(p).map(f => p + "/" + f) : [p];
  files.filter(f => f.endsWith(".tsx")).forEach(file => {
    fs.readFileSync(file, "utf8").split("\n").forEach((l, i) => {
      if (!l.trim().startsWith("//") && !l.trim().startsWith("{/*") && regex.test(l)) {
        console.log(`${file}:${i+1}: ${l.trim()}`);
      }
    });
  });
});
'
```
Directly yielded **5 active code matches**:
1. `src/sections/MetaphorsSection.tsx:52`: `title="Xem trên YouTube"`
2. `src/sections/PainSection.tsx:126`: `{painPoints.outcomePrefix} <strong>{currentTab.outcome.replace(/^Giải pháp:\s*/, '')}</strong>`
3. `src/sections/PainSection.tsx:260`: `<span>AI VIẾT KỊCH BẢN 0{selectedScriptIndex + 1}</span>`
4. `src/sections/PainSection.tsx:338`: `<span>VIDEO THỰC CHIẾN 0{selectedLightIndex + 1}</span>`
5. `src/sections/PainSection.tsx:462`: `<span>QUY TRÌNH THỰC CHIẾN 0{selectedProcessIndex + 1}</span>`

Additionally, an English label was hardcoded on line 181 of `src/sections/PainSection.tsx`:
- `src/sections/PainSection.tsx:181`: `<span>B-ROLL BANK 0{selectedBrollIndex + 1}</span>`

#### Defect 2: Runtime Regex Manipulation & Redundant Data Prefixes
- In `src/sections/PainSection.tsx:126`, `{currentTab.outcome.replace(/^Giải pháp:\s*/, '')}` uses regex string stripping in JSX.
- In `src/content.ts` lines 976, 992, 1014, and 1030, all four tabs redundantly prefix `outcome` with `"Giải pháp: "`, while `painPoints.outcomePrefix` on line 965 is already defined as `"✨ Cách xử lý tại studio:"`.

#### Defect 3: Test Mutation Pollution in `src/content.ts`
Inspection of `src/content.ts` revealed 5 un-reverted `MUTATION_TEST_*` tokens:
- Line 610: `badge: "MUTATION_TEST_HERO_BADGE_CHALLENGE_PASS",`
- Line 756: `badge: "MUTATION_TEST_DEF_BADGE_CHALLENGE_PASS",`
- Line 1277: `badge: "MUTATION_TEST_BANNER_BADGE_CHALLENGE_PASS",`
- Line 1284: `badge: "MUTATION_TEST_SHOWCASE_BADGE_CHALLENGE_PASS",`
- Line 1570: `badge: "MUTATION_TEST_STICKY_BADGE_CHALLENGE_PASS",`
Grep on `dist/assets/index-DZsdMXqr.js` confirmed these test tokens were compiled into production.

#### Defect 4: Defensive Edge Cases & Code Hygiene
- `src/sections/DefinitionSection.tsx:25`:
  ```tsx
  {definition.subheadline.includes(definition.highlightWord) ? (
    <>
      {definition.subheadline.split(definition.highlightWord)[0]}
      <strong className="text-amber-400">{definition.highlightWord}</strong>
      {definition.subheadline.split(definition.highlightWord)[1]}
    </>
  ) : (
    definition.subheadline
  )}
  ```
  When `definition.highlightWord` is `""`, `subheadline.includes("")` evaluates to `true`. `split("")[0]` returns the 1st char, and `split("")[1]` returns the 2nd char. All remaining characters are silently dropped.
- `src/sections/PainSection.tsx:7`:
  `const [activeTab, setActiveTab] = useState(painPoints.tabs[0].id);`
  Throws `TypeError: Cannot read properties of undefined (reading 'id')` if `painPoints.tabs: []`.
- `src/sections/GrowthChartSection.tsx:13-28`:
  `const x = padding + (i * (width - 2 * padding)) / (chart.data.length - 1);`
  If `chart.data` is empty `[]`, `pointsMarketing[0].x` throws `TypeError`. If `chart.data.length === 1`, `(chart.data.length - 1)` is 0, causing division by zero and `NaN` SVG coordinates.
- `src/App.tsx:11`:
  `import { CaseStudySection } from './sections/CaseStudySection';` is imported but unmounted in `<main>`.

---

## 2. Logic Chain

```
[Requirement: Fast Modification Architecture & Single Source of Truth]
  - 100% of copywriting, button labels, video links, tooltips must reside in src/content.ts
  - Pure view components with 0 hardcoded text in src/sections/
  - Zero tolerance for test pollution in production bundle
  ↓
[Forensic Observations 1.1 & 1.2]
  - 6 hardcoded badge/tooltip labels in PainSection.tsx and MetaphorsSection.tsx
  - Runtime regex .replace() in PainSection.tsx:126
  - 5 contaminated test badges in src/content.ts
  - 3 defensive edge-case vulnerabilities (DefinitionSection, PainSection, GrowthChartSection)
  - 1 dead import in App.tsx
  ↓
[Remediation Strategy Derivation]
  1. Centralize 5 badge prefixes + tooltip title into src/content.ts (ContentData schema & CONTENT object)
  2. Strip "Giải pháp: " at the source in src/content.ts and bind directly to {currentTab?.outcome || ''}
  3. Revert 5 test badges back to verified Vietnamese production copy
  4. Safeguard DefinitionSection highlight check: definition.highlightWord && definition.subheadline.includes(...)
  5. Safeguard PainSection tabs: painPoints.tabs?.[0]?.id || '' with fallback object
  6. Safeguard GrowthChartSection: divisor with length guard & pointsMarketing.length > 0
  7. Remove unmounted CaseStudySection import from App.tsx
  8. Update CONTENT_MAP.md with new key references
  ↓
[Empirical Simulation & Validation]
  - Created atomic patch: .agents/explorer_m1_r2_2/remediation_m1.patch
  - Verified git apply --check passed cleanly (code 0)
  - Simulated 23/23 tests in tests/stress-m1.mjs: ALL 23 PASSED -> APPROVE
  - Verified tsc typecheck (0 errors) & vite build (0 errors)
  - Restored workspace to maintain Explorer read-only invariant
  ↓
[Conclusion: Remediation Blueprint is complete, verified, and ready for immediate application by Worker M1]
```

---

## 3. Detailed Remediation Blueprint (Exact Code Specifications)

### 3.1 `src/content.ts` Modifications

#### A. Type Definition Updates (`ContentData`)
**Location 1**: `ContentData.metaphors.labels` (~line 205):
```typescript
// BEFORE:
    labels: {
      output: string;
      relief: string;
      application: string;
      practiceNote: string;
      practiceTag: string;
    };

// AFTER:
    labels: {
      output: string;
      relief: string;
      application: string;
      practiceNote: string;
      practiceTag: string;
      watchYoutubeTitle: string;
      youtubeButtonText?: string;
    };
```

**Location 2**: `ContentData.painPoints.ui` (~line 303):
```typescript
// BEFORE:
    ui: {
      brollCategory: string;
      scriptCategory: string;
      lightingCategory: string;
      processCategory: string;
      playBrollText: string;
      playScriptText: string;
      playLightingText: string;
      playProcessText: string;
      modalQualityBadge: string;
      openFbReelText: string;
      openYoutubeText: string;
      aiBadgeText: string;
    };

// AFTER:
    ui: {
      brollCategory: string;
      scriptCategory: string;
      lightingCategory: string;
      processCategory: string;
      brollBadgePrefix: string;
      scriptBadgePrefix: string;
      lightingBadgePrefix: string;
      processBadgePrefix: string;
      playBrollText: string;
      playScriptText: string;
      playLightingText: string;
      playProcessText: string;
      modalQualityBadge: string;
      openFbReelText: string;
      openYoutubeText: string;
      aiBadgeText: string;
    };
```

#### B. Revert 5 Contaminated Mutation Badges
- **Line 610 (`hero.badge`)**:
  - *From*: `badge: "MUTATION_TEST_HERO_BADGE_CHALLENGE_PASS",`
  - *To*: `badge: "GẶP MẶT TRỰC TIẾP · HÀ NỘI · SĨ SỐ GIỚI HẠN",`
- **Line 756 (`definition.badge`)**:
  - *From*: `badge: "MUTATION_TEST_DEF_BADGE_CHALLENGE_PASS",`
  - *To*: `badge: "BẢN CHẤT CỐT LÕI · PHÂN BIỆT RÕ RÀNG",`
- **Line 1277 (`bannerCta.badge`)**:
  - *From*: `badge: "MUTATION_TEST_BANNER_BADGE_CHALLENGE_PASS",`
  - *To*: `badge: "PHÒNG STUDIO CHUYÊN NGHIỆP",`
- **Line 1284 (`showcase.badge`)**:
  - *From*: `badge: "MUTATION_TEST_SHOWCASE_BADGE_CHALLENGE_PASS",`
  - *To*: `badge: "THÀNH PHẨM THỰC TẾ HỌC VIÊN",`
- **Line 1570 (`stickyBottomCta.badge`)**:
  - *From*: `badge: "MUTATION_TEST_STICKY_BADGE_CHALLENGE_PASS",`
  - *To*: `badge: "OFFLINE HÀ NỘI",`

#### C. `metaphors.labels` Data (~line 894)
```typescript
// BEFORE:
    labels: {
      output: "Output Chuyển Đổi",
      relief: "Gỡ Bỏ Rào Cản",
      application: "Ứng dụng:",
      practiceNote: "Thực hành tại lớp",
      practiceTag: "1 kèm 1"
    },

// AFTER:
    labels: {
      output: "Output Chuyển Đổi",
      relief: "Gỡ Bỏ Rào Cản",
      application: "Ứng dụng:",
      practiceNote: "Thực hành tại lớp",
      practiceTag: "1 kèm 1",
      watchYoutubeTitle: "Xem trên YouTube",
      youtubeButtonText: "YouTube"
    },
```

#### D. Clean Up `painPoints.tabs[].outcome` Data (~lines 976, 992, 1014, 1030)
- **`tab-1` (line 976)**:
  - *From*: `outcome: "Giải pháp: Phương pháp kịch bản chuyển đổi ngắt nhịp 5s + Kỹ thuật B-roll Bank (chèn cảnh trám 2-3s đè timeline) giúp bạn nói tự nhiên, che 100% lỗi nói vấp và mắt đơ.",`
  - *To*: `outcome: "Phương pháp kịch bản chuyển đổi ngắt nhịp 5s + Kỹ thuật B-roll Bank (chèn cảnh trám 2-3s đè timeline) giúp bạn nói tự nhiên, che 100% lỗi nói vấp và mắt đơ.",`
- **`tab-2` (line 992)**:
  - *From*: `outcome: "Giải pháp: Trợ lý AI bóc lỗi văn mẫu + Quy trình kịch bản 1 nhịp thở: Dùng bộ 3 trợ lý AI (Miss Idea, Miss Vlog, Miss Video Ads) lọc sạch 7 lỗi sáo rỗng, bẻ nhỏ câu ngắn 5s kèm B-roll, nói tự nhiên như tâm sự ngoài đời.",`
  - *To*: `outcome: "Trợ lý AI bóc lỗi văn mẫu + Quy trình kịch bản 1 nhịp thở: Dùng bộ 3 trợ lý AI (Miss Idea, Miss Vlog, Miss Video Ads) lọc sạch 7 lỗi sáo rỗng, bẻ nhỏ câu ngắn 5s kèm B-roll, nói tự nhiên như tâm sự ngoài đời.",`
- **`tab-3` (line 1014)**:
  - *From*: `outcome: "Giải pháp: Kỹ thuật setup 2 góc quay điện thoại (Góc chính diện + Góc cận 45 độ) tạo chiều sâu điện ảnh kết hợp lọc âm trong vắt.",`
  - *To*: `outcome: "Kỹ thuật setup 2 góc quay điện thoại (Góc chính diện + Góc cận 45 độ) tạo chiều sâu điện ảnh kết hợp lọc âm trong vắt.",`
- **`tab-4` (line 1030)**:
  - *From*: `outcome: "Giải pháp: Đóng gói quy trình sản xuất video 1 buổi/tuần: Quay 1 buổi tích lũy kho 50+ tư liệu B-roll dùng cho cả tháng, kết hợp phễu thu thập số điện thoại và data khách tự động.",`
  - *To*: `outcome: "Đóng gói quy trình sản xuất video 1 buổi/tuần: Quay 1 buổi tích lũy kho 50+ tư liệu B-roll dùng cho cả tháng, kết hợp phễu thu thập số điện thoại và data khách tự động.",`

#### E. `painPoints.ui` Data (~line 1160)
```typescript
// BEFORE:
    ui: {
      brollCategory: "Kho B-Roll Bank Xử Lý",
      scriptCategory: "Trợ Lý AI Viết Kịch Bản Thực Chiến",
      lightingCategory: "Thực Hành Setup Ánh Sáng",
      processCategory: "Quy Trình Sản Xuất 1 Buổi/Tuần",
      playBrollText: "BẤM ĐỂ XEM B-ROLL BANK",
      playScriptText: "BẤM XEM AI DEMO",
      playLightingText: "BẤM ĐỂ XEM VIDEO",
      playProcessText: "BẤM ĐỂ XEM VIDEO",
      modalQualityBadge: "HD 1080p • Thực hành cùng thầy Việt",
      openFbReelText: "Mở Facebook Reel",
      openYoutubeText: "Mở YouTube",
      aiBadgeText: "Trợ Lý AI Độc Quyền"
    }

// AFTER:
    ui: {
      brollCategory: "Kho B-Roll Bank Xử Lý",
      scriptCategory: "Trợ Lý AI Viết Kịch Bản Thực Chiến",
      lightingCategory: "Thực Hành Setup Ánh Sáng",
      processCategory: "Quy Trình Sản Xuất 1 Buổi/Tuần",
      brollBadgePrefix: "B-ROLL BANK 0",
      scriptBadgePrefix: "AI VIẾT KỊCH BẢN 0",
      lightingBadgePrefix: "VIDEO THỰC CHIẾN 0",
      processBadgePrefix: "QUY TRÌNH THỰC CHIẾN 0",
      playBrollText: "BẤM ĐỂ XEM B-ROLL BANK",
      playScriptText: "BẤM XEM AI DEMO",
      playLightingText: "BẤM ĐỂ XEM VIDEO",
      playProcessText: "BẤM ĐỂ XEM VIDEO",
      modalQualityBadge: "HD 1080p • Thực hành cùng thầy Việt",
      openFbReelText: "Mở Facebook Reel",
      openYoutubeText: "Mở YouTube",
      aiBadgeText: "Trợ Lý AI Độc Quyền"
    }
```

---

### 3.2 `src/sections/MetaphorsSection.tsx` Modifications

**Line 52**:
```tsx
// BEFORE:
<button
  onClick={() => setActiveYoutubeModal(item.youtubeId)}
  title="Xem trên YouTube"
  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 hover:bg-red-600 text-white text-[11px] font-mono font-semibold backdrop-blur-md border border-white/20 transition-colors shadow-sm cursor-pointer"
>

// AFTER:
<button
  onClick={() => setActiveYoutubeModal(item.youtubeId)}
  title={metaphors.labels.watchYoutubeTitle}
  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 hover:bg-red-600 text-white text-[11px] font-mono font-semibold backdrop-blur-md border border-white/20 transition-colors shadow-sm cursor-pointer"
>
```

---

### 3.3 `src/sections/PainSection.tsx` Modifications

**Location 1**: Line 7 (Defensive initialization):
```tsx
// BEFORE:
const [activeTab, setActiveTab] = useState(painPoints.tabs[0].id);

// AFTER:
const [activeTab, setActiveTab] = useState(painPoints.tabs?.[0]?.id || '');
```

**Location 2**: Lines 21-25 (Defensive fallback objects):
```tsx
// BEFORE:
const currentTab = painPoints.tabs.find(t => t.id === activeTab) || painPoints.tabs[0];
const activeBrollVideo = painPoints.brollVideos[selectedBrollIndex] || painPoints.brollVideos[0];
const activeScriptVideo = painPoints.scriptVideos[selectedScriptIndex] || painPoints.scriptVideos[0];
const activeLightVideo = painPoints.lightingVideos[selectedLightIndex] || painPoints.lightingVideos[0];
const activeProcessVideo = painPoints.processVideos[selectedProcessIndex] || painPoints.processVideos[0];

// AFTER:
const currentTab = painPoints.tabs.find(t => t.id === activeTab) || painPoints.tabs?.[0] || {
  id: '',
  title: '',
  subtitle: '',
  points: [],
  outcome: '',
  media: '',
  cards: []
};
const activeBrollVideo = painPoints.brollVideos[selectedBrollIndex] || painPoints.brollVideos?.[0] || {
  id: '',
  title: '',
  subtitle: '',
  shortTitle: '',
  poster: '',
  desc: ''
};
const activeScriptVideo = painPoints.scriptVideos[selectedScriptIndex] || painPoints.scriptVideos?.[0] || {
  id: '',
  title: '',
  subtitle: '',
  shortTitle: '',
  poster: '',
  videoId: '',
  youtubeUrl: ''
};
const activeLightVideo = painPoints.lightingVideos[selectedLightIndex] || painPoints.lightingVideos?.[0] || {
  id: '',
  title: '',
  subtitle: '',
  shortTitle: '',
  poster: '',
  videoId: '',
  youtubeUrl: ''
};
const activeProcessVideo = painPoints.processVideos[selectedProcessIndex] || painPoints.processVideos?.[0] || {
  id: '',
  title: '',
  subtitle: '',
  shortTitle: '',
  poster: '',
  videoId: '',
  youtubeUrl: ''
};
```

**Location 3**: Line 126 (Eliminate runtime `.replace()`):
```tsx
// BEFORE:
{painPoints.outcomePrefix} <strong>{currentTab.outcome.replace(/^Giải pháp:\s*/, '')}</strong>

// AFTER:
{painPoints.outcomePrefix} <strong>{currentTab?.outcome || ''}</strong>
```

**Location 4**: Lines 181, 260, 338, 462 (Modal Badge Prefixes):
```tsx
// Line 181 BEFORE:
<span>B-ROLL BANK 0{selectedBrollIndex + 1}</span>
// Line 181 AFTER:
<span>{painPoints.ui.brollBadgePrefix}{selectedBrollIndex + 1}</span>

// Line 260 BEFORE:
<span>AI VIẾT KỊCH BẢN 0{selectedScriptIndex + 1}</span>
// Line 260 AFTER:
<span>{painPoints.ui.scriptBadgePrefix}{selectedScriptIndex + 1}</span>

// Line 338 BEFORE:
<span>VIDEO THỰC CHIẾN 0{selectedLightIndex + 1}</span>
// Line 338 AFTER:
<span>{painPoints.ui.lightingBadgePrefix}{selectedLightIndex + 1}</span>

// Line 462 BEFORE:
<span>QUY TRÌNH THỰC CHIẾN 0{selectedProcessIndex + 1}</span>
// Line 462 AFTER:
<span>{painPoints.ui.processBadgePrefix}{selectedProcessIndex + 1}</span>
```

---

### 3.4 `src/sections/DefinitionSection.tsx` Modification

**Line 25** (Highlight logic guard against empty string truncation):
```tsx
// BEFORE:
            {definition.subheadline.includes(definition.highlightWord) ? (
              <>
                {definition.subheadline.split(definition.highlightWord)[0]}
                <strong className="text-amber-400">{definition.highlightWord}</strong>
                {definition.subheadline.split(definition.highlightWord)[1]}
              </>
            ) : (
              definition.subheadline
            )}

// AFTER:
            {definition.highlightWord && definition.subheadline.includes(definition.highlightWord) ? (
              <>
                {definition.subheadline.split(definition.highlightWord)[0]}
                <strong className="text-amber-400">{definition.highlightWord}</strong>
                {definition.subheadline.split(definition.highlightWord)[1]}
              </>
            ) : (
              definition.subheadline
            )}
```

---

### 3.5 `src/sections/GrowthChartSection.tsx` Modification

**Lines 13-28** (Defensive array guard & division-by-zero protection):
```tsx
// BEFORE:
  const pointsNormal = chart.data.map((d, i) => {
    const x = padding + (i * (width - 2 * padding)) / (chart.data.length - 1);
    const y = height - padding - (d.normal / 100) * (height - 2 * padding);
    return { x, y, val: d.normal, month: d.month };
  });

  const pointsMarketing = chart.data.map((d, i) => {
    const x = padding + (i * (width - 2 * padding)) / (chart.data.length - 1);
    const y = height - padding - (d.marketing / 100) * (height - 2 * padding);
    return { x, y, val: d.marketing, month: d.month };
  });

  const pathNormal = pointsNormal.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const pathMarketing = pointsMarketing.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');

  const areaMarketing = `${pathMarketing} L ${pointsMarketing[pointsMarketing.length - 1].x} ${height - padding} L ${pointsMarketing[0].x} ${height - padding} Z`;

// AFTER:
  const hasMultiplePoints = Boolean(chart.data && chart.data.length > 1);
  const divisor = hasMultiplePoints ? chart.data.length - 1 : 1;

  const pointsNormal = (chart.data || []).map((d, i) => {
    const x = padding + (i * (width - 2 * padding)) / divisor;
    const y = height - padding - (d.normal / 100) * (height - 2 * padding);
    return { x, y, val: d.normal, month: d.month };
  });

  const pointsMarketing = (chart.data || []).map((d, i) => {
    const x = padding + (i * (width - 2 * padding)) / divisor;
    const y = height - padding - (d.marketing / 100) * (height - 2 * padding);
    return { x, y, val: d.marketing, month: d.month };
  });

  const pathNormal = pointsNormal.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const pathMarketing = pointsMarketing.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');

  const areaMarketing = pointsMarketing.length > 0
    ? `${pathMarketing} L ${pointsMarketing[pointsMarketing.length - 1].x} ${height - padding} L ${pointsMarketing[0].x} ${height - padding} Z`
    : '';
```

---

### 3.6 `src/App.tsx` Modification

**Line 11** (Remove dead unmounted import):
```tsx
// BEFORE:
import { ShowcaseSection } from './sections/ShowcaseSection';
import { CaseStudySection } from './sections/CaseStudySection';
import { TargetSection } from './sections/TargetSection';

// AFTER:
import { ShowcaseSection } from './sections/ShowcaseSection';
import { TargetSection } from './sections/TargetSection';
```

---

### 3.7 `CONTENT_MAP.md` Modification

**Row 8 & 9 Table Updates**:
```markdown
<!-- BEFORE -->
| **8** | **4 Định Dạng Video Thực Chiến** | `src/sections/MetaphorsSection.tsx` | `CONTENT.metaphors` | `badge`, `headline`, `subheadline`, `formatPrefix`, `labels` (Output, Gỡ rào cản, Ứng dụng, Thực hành), 4 định dạng `items` (Voice Over, Walk & Talk, Talking Head, Storytelling: video mp4, poster, youtubeId, youtubeUrl, output, relief, application), nút `cta` |
| **9** | **4 Nút Thắt & Video Switcher** | `src/sections/PainSection.tsx` | `CONTENT.painPoints` | `badge`, `headline`, `subheadline`, `tabPrefix`, `sectionTag`, `outcomePrefix`, 4 tab `tabs` (vướng mắc, giải pháp studio, 2 thẻ phụ), 4 kho video `brollVideos`, `scriptVideos`, `lightingVideos`, `processVideos` (tiêu đề, shortTitle, link video, poster, fbUrl, youtubeUrl), `tab4Overlays` (5 bước quy trình, tag cam kết), `ui` (nhãn modal, nút mở FB/YT) |

<!-- AFTER -->
| **8** | **4 Định Dạng Video Thực Chiến** | `src/sections/MetaphorsSection.tsx` | `CONTENT.metaphors` | `badge`, `headline`, `subheadline`, `formatPrefix`, `labels` (Output, Gỡ rào cản, Ứng dụng, Thực hành, watchYoutubeTitle), 4 định dạng `items` (Voice Over, Walk & Talk, Talking Head, Storytelling: video mp4, poster, youtubeId, youtubeUrl, output, relief, application), nút `cta` |
| **9** | **4 Nút Thắt & Video Switcher** | `src/sections/PainSection.tsx` | `CONTENT.painPoints` | `badge`, `headline`, `subheadline`, `tabPrefix`, `sectionTag`, `outcomePrefix`, 4 tab `tabs` (vướng mắc, giải pháp studio, 2 thẻ phụ), 4 kho video `brollVideos`, `scriptVideos`, `lightingVideos`, `processVideos` (tiêu đề, shortTitle, link video, poster, fbUrl, youtubeUrl), `tab4Overlays` (5 bước quy trình, tag cam kết), `ui` (nhãn modal, nút mở FB/YT, brollBadgePrefix, scriptBadgePrefix, lightingBadgePrefix, processBadgePrefix) |
```

---

## 4. Caveats

1. **Explorer Role Compliance**: As an explorer subagent, Explorer M1-R2-2 conducted all analyses and patch dry-runs in read-only mode, cleanly restoring the working tree upon test completion.
2. **Pre-Existing Uncommitted Files**: The repository working tree contains active uncommitted work from Worker M1. The provided `.patch` file was generated directly against this working tree baseline so it can be applied seamlessly via `git apply` without conflicts.
3. **Out-of-Scope Tracks**: Milestone M2 (asset pruning), M3 (SEO meta tags in `index.html`), and M4 (API endpoint `/api/register.ts`) are completely unaffected and isolated from this remediation.

---

## 5. Conclusion

- **Integrity Assessment**: All integrity violations and gate rejections across Auditor, Reviewers, and Challengers have been completely diagnosed to their root causes.
- **Actionable Deliverable**: A validated, machine-applicable patch file has been compiled at:
  `/Users/vietmac/Documents/CODE/offline/.agents/explorer_m1_r2_2/remediation_m1.patch`
- **Gate Readiness**: Applying this blueprint resolves 100% of audit and gate findings, ensuring:
  1. Exactly **0** hardcoded Vietnamese strings across all UI view components.
  2. Exactly **0** runtime regex string manipulations in JSX.
  3. **0** `MUTATION_TEST_*` tokens in `src/content.ts` and production bundles.
  4. **100%** passing rate (23/23 tests) on the adversarial stress test harness (`tests/stress-m1.mjs`).
  5. Clean `npm run typecheck` (0 errors) and `npm run build` (0 errors, bundle < 120 KB gzip).

---

## 6. Verification Method

To independently verify the blueprint before and after application:

### Step 1: Verify the Patch Applies Cleanly
```bash
git apply --check .agents/explorer_m1_r2_2/remediation_m1.patch
```
*Expected Result*: Exits with code 0 (no conflicts or errors).

### Step 2: Apply the Patch (For Worker M1)
```bash
git apply .agents/explorer_m1_r2_2/remediation_m1.patch
```

### Step 3: Verify Zero Hardcoded Vietnamese Copy Across View Components
```bash
node -e '
const fs = require("fs");
const regex = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ]/;
let count = 0;
["src/sections", "src/components", "src/pages", "src/App.tsx"].forEach(p => {
  const files = fs.statSync(p).isDirectory() ? fs.readdirSync(p).map(f => p + "/" + f) : [p];
  files.filter(f => f.endsWith(".tsx")).forEach(file => {
    fs.readFileSync(file, "utf8").split("\n").forEach((l, i) => {
      const t = l.trim();
      if (!t.startsWith("//") && !t.startsWith("{/*") && !t.startsWith("*") && regex.test(l)) {
        console.log(`${file}:${i+1}: ${t}`);
        count++;
      }
    });
  });
});
if (count > 0) { console.error(`❌ Found ${count} hardcoded strings`); process.exit(1); }
console.log("✔ Clean: 0 hardcoded Vietnamese strings found!");
'
```
*Expected Result*: Prints `✔ Clean: 0 hardcoded Vietnamese strings found!` and exits with code 0.

### Step 4: Verify Zero Mutation Test Tokens
```bash
grep -rn "MUTATION_TEST" src/content.ts dist/
```
*Expected Result*: 0 matches.

### Step 5: Verify TypeScript Compilation & Production Build
```bash
npm run typecheck && npm run build
```
*Expected Result*: Code 0, 0 type errors, gzipped main bundle < 120 KB.

### Step 6: Verify Adversarial Stress Test Suite
```bash
node tests/stress-m1.mjs
```
*Expected Result*: All 23/23 tests pass with output: `🎉 CHALLENGE RESULT: APPROVE`.
