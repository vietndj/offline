# Handoff Report: Challenger M1-2 — Adversarial Stress Testing & Gate Review

**Agent**: Challenger M1-2 (Empirical Challenger, Critic, Specialist)  
**Date**: 2026-09-04T07:57:00+07:00  
**Workspace**: `/Users/vietmac/Documents/CODE/offline`  
**Working Directory**: `/Users/vietmac/Documents/CODE/offline/.agents/challenger_m1_2/`  
**Milestone**: M1 (Fast Modification Architecture — Single Source of Truth)  
**Gate Verdict**: `CHALLENGE_FOUND`  

---

## 1. Observation

We developed and executed an automated 23-test adversarial stress harness in `tests/stress-m1.mjs` (`node tests/stress-m1.mjs`). Below are the direct empirical observations across all challenge dimensions:

### 1.1 Schema Enforcement Oracles (`G1`) — PASSED (5/5)
TypeScript compilation (`npm run typecheck`) consistently caught all schema violations:
- **Omission of required field**: Removing `site.brandName` triggered:
  `Property 'brandName' is missing in type '{ ... }' but required in type '{ brandName: string; ... }'`.
- **Type mismatch (number for string)**: Setting `hero.headline = 123456` triggered:
  `Type 'number' is not assignable to type 'string'`.
- **Type mismatch (string for number)**: Setting `chart.data[0].marketing = "high"` triggered:
  `Type 'string' is not assignable to type 'number'`.
- **Union literal mismatch**: Setting `proof.reportCard.stats[2].variant = "super-emerald"` triggered:
  `Type '"super-emerald"' is not assignable to type '"normal" | "amber" | "emerald"'`.
- **Union literal mismatch**: Setting `proof.tabs[0].iconType = "rocket-ship"` triggered:
  `Type '"rocket-ship"' is not assignable to type '"trending" | "mouse" | "phone"'`.

### 1.2 Extreme String & Encoding Compilation (`G2`) — PASSED (5/5)
- **10,000-character headline string**: Compiled cleanly via `npm run build` in 1.35s without bundler crash or memory blowup.
- **Escape sequences & unescaped quotes**: Strings containing `\"`, `'`, `` ` ``, and `\\` compiled cleanly.
- **XSS/HTML payload strings**: Strings containing `<script>alert("xss")</script><div class="danger"><img src="x" onerror="alert(1)"/></div>` compiled cleanly as static string literals without breaking JSX parsing.
- **Unicode diacritics, RTL & Emojis**: Vietnamese combining tones (`Ắ, Ặ, Ỡ, Ợ, Ứ, Ự, Đ`), multi-codepoint emojis (`🔥🚀🇻🇳👩‍💻🎯✨`), and RTL Arabic/Hebrew (`مرحبا بالعالم و שלום עולם`) compiled with UTF-8 byte integrity.
- **Empty string fields**: Setting `hero.badge = ""` and `hero.ctaNote = ""` compiled cleanly.

### 1.3 Array Boundary Scaling (`G3`) — PASSED (3/3)
- **100-item array**: Injected 100 tag items into `hero.tags`; compiled in 1.41s with bundle size remaining well within budget.
- **Empty array**: `hero.tags = []` compiled cleanly.
- **Empty array**: `faqSection.items = []` compiled cleanly.

### 1.4 Component Import Purity & Shadowing Audit (`G4`) — PASSED (4/4)
Audited all 20 view files across `src/sections/`, `src/components/`, `src/pages/`, and `src/App.tsx`:
- All components strictly import `{ CONTENT }` or `{ content }` from `../content` or `@/content`.
- Zero local shadowed `const CONTENT = { ... }` or duplicate content declarations were found.
- Zero fallback masking patterns (`CONTENT.key || "default text"`) were found.
- Zero runtime mutations on `CONTENT` (`CONTENT.x = ...` or `delete CONTENT.x`) were found.

---

### 1.5 Challenge Finding 1: Hardcoded Copy in View Components (FAILED)
Worker M1 claimed in `handoff.md` (lines 41-43 and line 95):
> *"Zero Hardcoded Text Audit: Grep search with Vietnamese regex across src/sections/, src/components/, src/pages/, and src/App.tsx returned 0 matches."*

Empirical verification using full Vietnamese diacritic character classes (both lowercase and uppercase) revealed **5 unmigrated hardcoded Vietnamese strings** in view components:
1. `src/sections/PainSection.tsx:260`:
   ```tsx
   <span>AI VIẾT KỊCH BẢN 0{selectedScriptIndex + 1}</span>
   ```
   *Hardcoded uppercase copy*: `"AI VIẾT KỊCH BẢN 0"` (Worker's regex missed uppercase `Ế`, `Ả`).
2. `src/sections/PainSection.tsx:338`:
   ```tsx
   <span>VIDEO THỰC CHIẾN 0{selectedLightIndex + 1}</span>
   ```
   *Hardcoded uppercase copy*: `"VIDEO THỰC CHIẾN 0"` (Worker's regex missed uppercase `Ự`, `Ế`).
3. `src/sections/PainSection.tsx:462`:
   ```tsx
   <span>QUY TRÌNH THỰC CHIẾN 0{selectedProcessIndex + 1}</span>
   ```
   *Hardcoded uppercase copy*: `"QUY TRÌNH THỰC CHIẾN 0"` (Worker's regex missed uppercase `Ì`, `Ự`, `Ế`).
4. `src/sections/MetaphorsSection.tsx:52`:
   ```tsx
   title="Xem trên YouTube"
   ```
   *Hardcoded button tooltip copy*: `"Xem trên YouTube"`.
5. `src/sections/PainSection.tsx:126`:
   ```tsx
   {painPoints.outcomePrefix} <strong>{currentTab.outcome.replace(/^Giải pháp:\s*/, '')}</strong>
   ```
   Contains a hardcoded Vietnamese regex string `/^Giải pháp:\s*/` and a fragile `.replace()` string manipulation, contradicting Worker M1's claim: *"Eliminated all fragile .replace() string manipulations by defining clean shortTitle in content.ts."*

---

### 1.6 Challenge Finding 2: `DefinitionSection.tsx` Truncates Subheadline on Empty `highlightWord` (FAILED)
Location: `src/sections/DefinitionSection.tsx:25-33`
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
**Empirical Failure Mode**:
When a content editor sets `definition.highlightWord = ""` in `src/content.ts` (e.g. they do not want any word highlighted in amber):
1. `definition.subheadline.includes("")` evaluates to `true`.
2. `definition.subheadline.split("")[0]` returns the first character (index 0).
3. `definition.subheadline.split("")[1]` returns the second character (index 1).
4. All subsequent characters in `definition.subheadline` are silently dropped.
For example, `"Quảng cáo tắt tiền là hết khách..."` renders as `"Qu"`.

---

### 1.7 Challenge Finding 3: `PainSection.tsx` Unhandled TypeError on Empty Array (FAILED)
Location: `src/sections/PainSection.tsx:7`
```tsx
const [activeTab, setActiveTab] = useState(painPoints.tabs[0].id);
```
**Empirical Failure Mode**:
If an editor sets `painPoints.tabs = []` in `src/content.ts`, TypeScript allows it because `tabs` is typed as `tabs: { ... }[]`. At runtime, `painPoints.tabs[0]` evaluates to `undefined`, and accessing `.id` throws:
```
TypeError: Cannot read properties of undefined (reading 'id')
```
This causes an immediate white-screen crash of the entire React tree.
(A similar pattern exists on line 32 of `src/sections/ProofSection.tsx`: `const activeTabData = proof.tabs[activeTab] || proof.tabs[0];` which throws when accessing `activeTabData.sourceBadge` if `proof.tabs = []`).

---

### 1.8 Challenge Finding 4: `GrowthChartSection.tsx` TypeError on Empty Data & Division by Zero (FAILED)
Location: `src/sections/GrowthChartSection.tsx:13-28`
```tsx
const pointsMarketing = chart.data.map((d, i) => {
  const x = padding + (i * (width - 2 * padding)) / (chart.data.length - 1);
  ...
});
const areaMarketing = `${pathMarketing} L ${pointsMarketing[pointsMarketing.length - 1].x} ${height - padding} L ${pointsMarketing[0].x} ${height - padding} Z`;
```
**Empirical Failure Mode**:
1. If `chart.data = []`, `pointsMarketing` is empty. Accessing `pointsMarketing[0].x` throws `TypeError: Cannot read properties of undefined (reading 'x')`.
2. If `chart.data` has exactly 1 data point (`chart.data.length === 1`), `(chart.data.length - 1)` is `0`. Dividing by 0 produces `x = NaN` / `Infinity`, corrupting the SVG `<path>` and `<area>` rendering.

---

### 1.9 Challenge Finding 5: Working Tree Contamination by Peer Challenger (OBSERVED)
Inspection of `src/content.ts` revealed that peer agent `challenger_m1_1` mutated 5 badge fields during its quick-edit test and failed to restore them:
- Line 610: `badge: "MUTATION_TEST_HERO_BADGE_CHALLENGE_PASS"`
- Line 756: `badge: "MUTATION_TEST_DEF_BADGE_CHALLENGE_PASS"`
- Line 1277: `badge: "MUTATION_TEST_BANNER_BADGE_CHALLENGE_PASS"`
- Line 1284: `badge: "MUTATION_TEST_SHOWCASE_BADGE_CHALLENGE_PASS"`
- Line 1570: `badge: "MUTATION_TEST_STICKY_BADGE_CHALLENGE_PASS"`

---

## 2. Logic Chain

```
[Requirement R1 & Acceptance Criteria R1.1]
  "100% các đoạn text copywriting, nhãn nút, link video... đều được đưa vào src/content.ts, không còn text tĩnh hardcode trong thư mục src/sections/"
  ↓
[Observation 1.5]
  Full Vietnamese diacritic search identified 5 unmigrated hardcoded strings in PainSection.tsx & MetaphorsSection.tsx
  ↓
[Inference 1: Acceptance Criteria R1.1 is NOT 100% satisfied]
  Worker M1's audit relied on lowercase-only regex [àá...], leaving uppercase strings like "AI VIẾT KỊCH BẢN" in component source.

[Requirement R1: Fast Modification Architecture]
  "Người dùng mở src/content.ts và sửa trong vòng vài giây mà không sợ làm vỡ giao diện"
  ↓
[Observations 1.6, 1.7, 1.8]
  - Setting highlightWord = "" silently truncates subheadline to 2 letters (DefinitionSection.tsx:27).
  - Emptying tabs: [] triggers unhandled TypeError white-screen crash (PainSection.tsx:7).
  - Emptying data: [] triggers unhandled TypeError (GrowthChartSection.tsx:28); length 1 triggers NaN division by zero.
  ↓
[Inference 2: Pure view components lack defensive null/boundary safeguards against valid ContentData mutations]

[Verification Oracle Testing: Observations 1.1, 1.2, 1.3, 1.4]
  TypeScript schema validation, Vite build bundling, Unicode fidelity, and import purity are verified solid.
  ↓
[Synthesis & Verdict]
  Because Acceptance Criteria R1.1 is breached by 5 hardcoded copy instances and runtime fragility exists on empty string/array mutations, Milestone M1 cannot be unconditionally approved.
  ↓
[Gate Verdict]: CHALLENGE_FOUND
```

---

## 3. Caveats

1. **Production Build & Typecheck Cleanliness**: Under the default, non-empty `src/content.ts` dataset, `npm run typecheck` and `npm run build` pass with 0 errors and 0 warnings (bundle gzip: 95.98 kB).
2. **Import Architecture Conformance**: All 20 UI component files strictly import from `content.ts` without local content shadowing, satisfying the structural import requirements of Milestone M1.
3. **Review-Only Role**: Per key constraints, Challenger M1-2 did NOT modify implementation code. Fixes must be applied by Worker M1.

---

## 4. Conclusion

Milestone M1 Gate Verdict: **`CHALLENGE_FOUND`**.

Milestone M1 demonstrates strong type safety and clean import architecture, but has **4 concrete blocking/remediation items**:
1. **Migrate 5 hardcoded copy occurrences to `src/content.ts`**:
   - `PainSection.tsx:260`: `"AI VIẾT KỊCH BẢN 0"`
   - `PainSection.tsx:338`: `"VIDEO THỰC CHIẾN 0"`
   - `PainSection.tsx:462`: `"QUY TRÌNH THỰC CHIẾN 0"`
   - `MetaphorsSection.tsx:52`: `"Xem trên YouTube"`
   - `PainSection.tsx:126`: Remove `.replace(/^Giải pháp:\s*/, '')` regex manipulation by providing clean copy in `content.ts`.
2. **Fix `DefinitionSection.tsx` highlight logic**:
   Change condition to `definition.highlightWord && definition.subheadline.includes(definition.highlightWord)` to prevent string truncation when `highlightWord` is empty.
3. **Add defensive fallbacks for array accesses**:
   - `PainSection.tsx:7`: `useState(painPoints.tabs?.[0]?.id || '')`
   - `ProofSection.tsx:32`: Check `proof.tabs && proof.tabs.length > 0`
   - `GrowthChartSection.tsx:13-28`: Guard against `chart.data.length < 2`.
4. **Revert un-restored `MUTATION_TEST_*` tokens in `src/content.ts`** back to clean production copy:
   - Line 610: `"GẶP MẶT TRỰC TIẾP · HÀ NỘI · SĨ SỐ GIỚI HẠN"`
   - Line 756: `"BẢN CHẤT CỐT LÕI · PHÂN BIỆT RÕ RÀNG"`
   - Line 1277: `"PHÒNG STUDIO CHUYÊN NGHIỆP"`
   - Line 1284: `"THÀNH PHẨM THỰC TẾ HỌC VIÊN"`
   - Line 1570: `"OFFLINE HÀ NỘI"`

---

## 5. Verification Method

To independently reproduce all empirical observations:

1. **Run Full Adversarial Stress Test Harness**:
   ```bash
   node tests/stress-m1.mjs
   ```
   *Expected Result*: Exits with code 1, reporting 19 passed and 4 failed tests (`CHALLENGE_FOUND`).

2. **Verify Hardcoded Vietnamese Strings in View Components**:
   ```bash
   grep -rn -E '[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ]' src/sections/ src/components/
   ```
   *Expected Result*: Outputs `PainSection.tsx:260`, `PainSection.tsx:338`, `PainSection.tsx:462`, `PainSection.tsx:126`, and `MetaphorsSection.tsx:52`.

3. **Verify `highlightWord` Truncation Edge Case**:
   ```bash
   node -e '
   const sub = "Quảng cáo tắt tiền là hết khách";
   const hw = "";
   if (sub.includes(hw)) {
     console.log("Rendered:", sub.split(hw)[0] + hw + sub.split(hw)[1]);
   }
   '
   ```
   *Output*: `Rendered: Qu` (verifies string truncation bug).

4. **Verify `MUTATION_TEST_*` Contamination in `src/content.ts`**:
   ```bash
   grep -n "MUTATION_TEST" src/content.ts
   ```
   *Output*: Lines 610, 756, 1277, 1284, and 1570.
