# Handoff Report: Build, Bundle Performance & Asset Footprint Survey

**Explorer**: Explorer Survey 2  
**Date**: 2026-09-04T00:43:00Z  
**Project**: `offline.fedu.vn` (Single-Page Video Marketing Workshop Landing Page)  
**Working Directory**: `/Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_2/`  
**Target Milestone**: Survey Phase → R2 Performance & Cleanup Optimization  

---

## 1. Observation

### 1.1 Tool Commands & Build Outputs

#### Typecheck Execution
- **Command**: `npm run typecheck`
- **Script in `package.json`**: `"tsc -p tsconfig.json --noEmit"`
- **Result**: Exit code `0` (clean, 0 type errors).
```
> 30ngayviral-fedu-vn@1.0.0 typecheck
> tsc -p tsconfig.json --noEmit
```

#### Production Build Execution
- **Command**: `npm run build`
- **Script in `package.json`**: `"npx vite@7.3.2 build --config vite.config.ts"`
- **Result**: Exit code `0` in `1.69s`, transformed 1,852 modules.
- **Build Output Summary**:
```
dist/index.html                   3.47 kB │ gzip:  1.55 kB
dist/assets/index-DT9nT6Q4.css   20.93 kB │ gzip:  4.23 kB
dist/assets/index-AtwfbqLk.js   342.85 kB │ gzip: 96.09 kB
```

### 1.2 Bundle Size Measurements & Breakdown

Direct buffer compression measurements on production artifacts:
| Asset | Raw Size | Gzip Size | Brotli Size | R2 Criteria (< 120KB gzip) |
|---|---|---|---|---|
| **Main JS** (`dist/assets/index-AtwfbqLk.js`) | 342,847 B (334.81 KiB / 342.85 kB) | 96,089 B (93.84 KiB / 96.09 kB) | 81,835 B (79.92 KiB / 81.84 kB) | **PASS** (96.09 KB < 120 KB) |
| **Main CSS** (`dist/assets/index-DT9nT6Q4.css`) | 20,933 B (20.44 KiB / 20.93 kB) | 4,230 B (4.13 KiB / 4.23 kB) | 3,680 B (3.59 KiB / 4.23 kB) | **Optimal** |
| **Entry HTML** (`dist/index.html`) | 3,472 B (3.47 kB) | 1,550 B (1.55 kB) | 1,350 B (1.35 kB) | **Optimal** |

#### Sourcemap Analysis (`sourcesContent` Byte Weight by Module):
- `react-dom` + `react` + `scheduler`: **540.26 KB** unminified source (~55% of vendor JS)
- `src/sections/` (13 sections combined): **139.77 KB**
- `src/content.ts`: **39.31 KB**
- `lucide-react`: **24.56 KB** (well tree-shaken, only used icons included)
- `src/components/` (Navbar, Footer, Modals): **13.81 KB**
- `src/pages/SuccessPage.tsx`: **2.90 KB**
- `src/App.tsx`: **2.64 KB**

### 1.3 Repository & Asset Footprint Overview

- Disk usage of project directories:
  - `dist/`: **344 MB** (copied automatically on each build from `public/`!)
  - `public/`: **322.74 MB** (116 files across 3 subdirectories and root)
- **Asset Type Breakdown in `public/`**:
  - `.mp4`: 19 files — **241.49 MB**
  - `.gif`: 6 files — **40.92 MB**
  - `.png`: 31 files — **30.47 MB**
  - `.jpg`: 37 files — **5.05 MB**
  - `.ttf` + `.otf`: 15 files — **2.82 MB**
  - `.webp`: 5 files — **1.97 MB**
  - `.DS_Store`: 1 file — **10 KB**
  - `.svg`: 1 file (`favicon.svg`) — **2.6 KB**
  - `.txt`: 1 file (`robots.txt`) — **23 B**

### 1.4 Unreferenced, Duplicate & Draft Assets Inventory

Our automated code reference scanner analyzed all TypeScript/TSX, HTML, and CSS files against all 116 assets in `public/`. Findings:

#### A. 51 Unreferenced Files in `public/` (Total: 90.72 MB / 28.1% of `public/` folder)

1. **Completely Dead GIF Assets (`public/gifs/`) — 40.92 MB**:
   - `gifs/lighting-art.gif`: 9,851,923 B (9.40 MB) — 0 references in code
   - `gifs/shot-sizes.gif`: 8,338,255 B (7.95 MB) — 0 references in code
   - `gifs/spatial-direction.gif`: 8,078,030 B (7.70 MB) — 0 references in code
   - `gifs/mechanical-cut.gif`: 7,615,821 B (7.26 MB) — 0 references in code
   - `gifs/lighting-3d.gif`: 6,008,603 B (5.73 MB) — 0 references in code
   - `gifs/invisible-cut.gif`: 3,016,066 B (2.88 MB) — 0 references in code

2. **Unused Video Files — 22.28 MB**:
   - `assets/lighting/light_ulanzi_aida.mp4`: 6,261,235 B (5.97 MB) — Only YouTube link used in UI
   - `assets/lighting/light_talkinghead.mp4`: 4,734,060 B (4.51 MB) — Only poster JPG used in UI
   - `assets/lighting/light_podcast_dt.mp4`: 4,719,543 B (4.50 MB) — Only YouTube link used in UI
   - `assets/formats/ai_miss_vlog_ngat_nhip.mp4`: 4,224,566 B (4.03 MB) — Content uses `shorts_ftuv04UxKJA.mp4` instead
   - `assets/lighting/light_2den_spotlight.mp4`: 3,424,561 B (3.27 MB) — Only YouTube link used in UI

3. **Unused & Duplicate Pain Point PNG Images — 20.06 MB**:
   - `assets/image_1782204137757-B_GzSTh2.png`: 2,797,786 B (2.67 MB)
   - `assets/pain/lam_deu_video.png`: 2,797,786 B (2.67 MB) — [Identical MD5 duplicate]
   - `assets/image_1782119991688-CzFs1kB-.png`: 2,717,684 B (2.59 MB)
   - `assets/pain/lan_man_kich_ban.png`: 2,717,684 B (2.59 MB) — [Identical MD5 duplicate]
   - `assets/image_1782189176146-dnh32Fxr.png`: 2,591,431 B (2.47 MB)
   - `assets/pain/chua_chuyen_nghiep.png`: 2,591,431 B (2.47 MB) — [Identical MD5 duplicate]
   - `assets/image_1782111290168-91rX6BTq.png`: 2,410,535 B (2.30 MB)
   - `assets/pain/bi_y_len_hinh.png`: 2,410,535 B (2.30 MB) — [Identical MD5 duplicate]
   *(Note: Neither the original pain PNGs nor their duplicate numbered copies are rendered in `PainSection.tsx`!)*

4. **Other Unused Draft Images & Optimizations — ~7.4 MB**:
   - `assets/gif4_opt-CoJcWNzO.webp`: 864,082 B (844 KB) — Unused
   - `assets/image_1781259495026-yBmDnAJ1.png`: 640,256 B (625 KB) — Unused
   - `assets/gif3_opt-BENmiLaC.webp`: 636,000 B (621 KB) — Unused
   - `assets/image_1781192238334-CSmHQDZt.png`: 560,536 B (547 KB) — Unused
   - `assets/fanpage_real_38k.png`: 554,055 B (541 KB) — [Identical MD5 duplicate of `fanpage_nguyenducviet.png`]
   - `assets/image_1781259464562-cWhsbWKV.png`: 521,765 B (510 KB) — Unused
   - `assets/gif2_opt-CAxvnZZj.webp`: 473,902 B (463 KB) — Unused
   - `assets/image_1782111083758-D1lt1pEb.png`: 420,270 B (410 KB) — Unused
   - 6 unused mockup cards in `assets/showcase/` (`option1_linear_card.jpg`, `option2_cach1_che_vap.jpg`, `option2_cach2_phong_nho.jpg`, `option2_cach3_nhip_cat.jpg`, `option2_cinema_lowerthird.jpg`, `option3_split_banner.jpg`): ~1.3 MB
   - 4 unused showcase photos (`halona.jpg`, `thuy.jpg`, `nguyet.jpg`, `disneyland.jpg`): ~600 KB
   - `feedback_hocvien_nganh_phan_bon_chot_nhanh.png`: 133,659 B (130 KB) — Unused draft feedback
   - `instructor.jpg`: 81,178 B (79 KB) — Unused (replaced by `image_1781192246239-Dsb4zlhm.png`)
   - `assets/offline2_opt-C2pqlP8_.webp`: 47,528 B — [Identical MD5 duplicate of `event_1on1_coaching.webp`]
   - `.DS_Store`: 10,244 B

*(Note on `opengraph.jpg` [80 KB] and `robots.txt` [23 B]: Keep both as they belong to R3 SEO requirements).*

#### B. Root Garbage & Draft Files
- `tong-hop-logic-3-tang-va-kich-ban-4-buoc.md`: 14,282 B in root directory (documentation/draft).

### 1.5 Heavy Referenced Media Requiring Optimization

1. **14 Referenced Local MP4 Videos (~215 MB total)**:
   - `bat_dau_vo_van.mp4`: **53.47 MB** (Has existing YouTube ID `-1ddyry_Qs0`)
   - `tham_tho_spa.mp4`: **43.60 MB**
   - `fb_reel_talkinghead_workflow.mp4`: **31.31 MB** (Has existing Facebook Reel link)
   - `shorts_ftuv04UxKJA.mp4`: **20.60 MB** (Has existing YouTube Shorts ID `ftuv04UxKJA`)
   - `nhathuoc_cattuong_49s.mp4`: **14.22 MB**
   - `vu_hai_long.mp4`: **12.38 MB**
   - `walktalk.mp4`: **12.19 MB** (Autoplays in `MetaphorsSection` on mount!)
   - `voiceover.mp4`: **9.67 MB** (Autoplays in `MetaphorsSection` on mount!)
   - `disneyland_broll_25s.mp4`: **6.36 MB**
   - `lop_k2.mp4`: **6.09 MB** (Has existing YouTube ID `WV8rggcgmGA`)
   - `ai_miss_idea_loc_van_mau.mp4`: **4.49 MB**
   - `ai_miss_video_ads_3phan.mp4`: **3.26 MB**
   - `storytelling.mp4`: **905 KB** (Autoplays in `MetaphorsSection` on mount!)
   - `talkinghead.mp4`: **706 KB** (Autoplays in `MetaphorsSection` on mount!)

2. **6 Heavily Oversized Referenced PNG Images (~6.2 MB total)**:
   - `assets/image_1781281916199-DoWUR6eO.png`: **1.68 MB** (Proof section metric chart)
   - `assets/tiktok_nguyenducviet.png`: **1.52 MB** (Social proof screenshot)
   - `assets/image_1781257789234-CGDyQOer.png`: **1.26 MB** (Growth chart metric)
   - `assets/events/event_full_class.png`: **899 KB** (Unoptimized PNG; JPG at 207 KB already exists in the same folder!)
   - `assets/image_1781281388562-DGSN1Etr.png`: **592 KB**
   - `assets/fanpage_nguyenducviet.png`: **541 KB**

3. **Autoplay Network Penalty in `MetaphorsSection.tsx`**:
   - Lines 39-47 render 4 `<video autoPlay loop muted playsInline>` tags simultaneously without lazy-loading.
   - On initial page load or when user scrolls to this section, the browser downloads all 4 format videos (**~23.5 MB**) concurrently over the network!

### 1.6 External CDN Dependencies & Fonts in `index.html`

In `index.html` (lines 14-19):
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700;800&display=swap" rel="stylesheet">
<link href="https://fonts.cdnfonts.com/css/aeonik" rel="stylesheet" />
<link href="https://fonts.cdnfonts.com/css/acta" rel="stylesheet" />
<script src="https://cdn.tailwindcss.com"></script>
```
- **Tailwind Play CDN (`cdn.tailwindcss.com`)**: Injected via `<script>` tag in production. The browser downloads ~350KB of runtime JIT compiler script to evaluate utility classes dynamically in the client DOM.
- **Redundant Fonts**:
  - `src/fonts.css` defines `@font-face` for 15 local TTF/OTF files totaling **2.82 MB**.
  - `index.html` ALSO loads Google Fonts and `cdnfonts.com` for Aeonik and Acta.

---

## 2. Logic Chain

```
[Observation 1.1]
npm run typecheck: 0 errors
npm run build: 0 errors, 1852 modules transformed in 1.69s
        │
        ▼
[Step 1: Baseline Health Assessment]
The codebase is in clean syntactic and TypeScript health. No compile errors block deployment.
        │
        ▼
[Observation 1.2]
Main JS bundle is 342.85 KB raw, 96.09 KB gzipped (< 120 KB requirement)
Main CSS bundle is 20.93 KB raw, 4.23 KB gzipped
        │
        ▼
[Step 2: Acceptance Criteria Verification]
Criterion "Main JS gzip < 120KB" is currently MET (96.09 KB < 120.00 KB).
However, 100% of application code (including SuccessPage and modals) is packed in a single monolithic bundle with no dynamic imports or code-splitting.
        │
        ▼
[Observation 1.3 & 1.4]
Total public/ folder is 322.74 MB.
Vite copies public/ verbatim to dist/ (344 MB).
51 files in public/ (90.72 MB) have 0 references in any code or content.
        │
        ▼
[Step 3: Dead Weight Elimination Logic]
Removing 51 unreferenced files immediately trims 90.72 MB (28.1% of repo assets) with zero functional regression.
Removing 6 byte-for-byte duplicate files avoids redundant disk footprint.
        │
        ▼
[Observation 1.5]
14 local MP4 videos take ~215 MB.
bat_dau_vo_van.mp4 (53.5 MB), shorts_ftuv04UxKJA.mp4 (20.6 MB), lop_k2.mp4 (6.1 MB) are already hosted on YouTube.
MetaphorsSection autoplays 23.5 MB of videos concurrently.
        │
        ▼
[Step 4: Media Architecture Logic]
Serving 215 MB of raw MP4s from Vercel static storage hits CDN bandwidth limits and slows page loads.
Routing video playback through YouTube nocookie iframe embeds (as already supported by modal components) eliminates ~80 MB of video payload immediately.
Replacing MetaphorsSection autoplay MP4s with WebP animations or click-to-play eliminates a 23.5 MB network choke on mobile.
        │
        ▼
[Observation 1.6]
index.html pulls cdn.tailwindcss.com (~350KB runtime JIT script) and external font CDNs in parallel with 2.8 MB local fonts.
        │
        ▼
[Step 5: Runtime Overhead Reduction Logic]
Replacing runtime Tailwind CDN with build-time CSS output completely removes client runtime JIT parsing overhead and prevents FOUC.
Consolidating fonts to WOFF2 format saves ~70% font payload.
```

---

## 3. Caveats

1. **R3 SEO Dependency**: `public/opengraph.jpg` (81.8 KB) and `public/robots.txt` (23 B) were detected as "unreferenced in TSX", but they are essential for R3 SEO requirements (`og:image` and search indexing) and must NOT be deleted.
2. **Video Embed Network Access**: Switching videos that have YouTube links from local `.mp4` files to YouTube iframe embeds requires client internet access to `youtube-nocookie.com`. For offline local testing, fallback posters must remain in place.
3. **Read-Only Explorer Scope**: In accordance with the Teamwork Explorer contract, Explorer 2 has NOT modified or deleted any files in `offline/` (except reports and audit scripts in `.agents/explorer_survey_2/`). All changes are proposed for the implementer agent.
4. **Tailwind JIT Dependency**: If Tailwind is migrated from CDN to build-time PostCSS/@tailwindcss/vite, ensure all dynamic utility classes generated from `src/content.ts` are covered in Tailwind's content scan config (`content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]`).

---

## 4. Conclusion & Concrete Recommendations

### 4.1 Summary of Survey Results

| Metric | Current State | Target / Benchmark | Status |
|---|---|---|---|
| **`npm run typecheck`** | 0 errors | 0 errors | ✅ Pass |
| **`npm run build`** | 0 errors | 0 errors | ✅ Pass |
| **Main JS Bundle (gzip)** | **96.09 KB** (342.85 KB raw) | < 120 KB | ✅ Pass |
| **Main CSS Bundle (gzip)** | **4.23 KB** (20.93 KB raw) | Optimal | ✅ Pass |
| **Public Asset Volume** | **322.74 MB** (116 files) | Minimal | ⚠️ Bloated |
| **Unreferenced Assets** | **90.72 MB** (51 files) | 0 MB | ❌ Action Required |
| **Duplicate Asset Files** | **6 pairs** (~11 MB redundant) | 0 | ❌ Action Required |
| **Autoplay Video Transfer** | **23.5 MB** on page view | < 2 MB | ❌ Action Required |
| **Tailwind Runtime** | Client CDN script (`cdn.tailwindcss.com`) | Build-time CSS | ⚠️ Action Required |

---

### 4.2 Actionable Optimization Plan for Implementer

#### Phase 1: Asset Pruning (Immediate ~90.7 MB Reduction)
1. **Delete the entire `public/gifs/` folder** (saves **40.92 MB**):
   - `lighting-art.gif`, `shot-sizes.gif`, `spatial-direction.gif`, `mechanical-cut.gif`, `lighting-3d.gif`, `invisible-cut.gif`.
2. **Delete unreferenced lighting and format videos** (saves **22.28 MB**):
   - `public/assets/lighting/light_ulanzi_aida.mp4` (5.97 MB)
   - `public/assets/lighting/light_talkinghead.mp4` (4.51 MB)
   - `public/assets/lighting/light_podcast_dt.mp4` (4.50 MB)
   - `public/assets/lighting/light_2den_spotlight.mp4` (3.27 MB)
   - `public/assets/formats/ai_miss_vlog_ngat_nhip.mp4` (4.03 MB)
3. **Delete unreferenced & duplicate Pain Point PNGs** (saves **20.06 MB**):
   - Delete both copies: `public/assets/pain/*.png` (4 files) and `public/assets/image_1782*.png` (4 files).
4. **Delete unreferenced draft images & duplicates** (saves **~7.4 MB**):
   - Delete `public/assets/gif2_opt...`, `gif3_opt...`, `gif4_opt...` (1.93 MB)
   - Delete 13 unreferenced numbered images: `image_1781192238334-CSmHQDZt.png`, `image_1781254269670-D7DNqlA1.png`, `image_1781259464562-cWhsbWKV.png`, `image_1781259495026-yBmDnAJ1.png`, `image_1782111018042-BY1jDPGq.png`, `image_1782111055199-CBeeJp36.png`, `image_1782111083758-D1lt1pEb.png`, `image_1782290169150-4GZe8SyB.png`, `image_1782290484902-PmZTfrWg.png`.
   - Delete duplicates: `public/assets/fanpage_real_38k.png` (541 KB) and `public/assets/offline2_opt-C2pqlP8_.webp` (47 KB).
   - Delete 6 design mockup cards: `public/assets/showcase/option1_...` to `option3_...` (~1.3 MB).
   - Delete unused photos: `halona.jpg`, `thuy.jpg`, `nguyet.jpg`, `disneyland.jpg`, `instructor.jpg`, `feedback_hocvien_nganh_phan_bon_chot_nhanh.png`.
   - Delete `public/.DS_Store`.
5. **Clean up root directory**:
   - Move or remove root draft `tong-hop-logic-3-tang-va-kich-ban-4-buoc.md`.

#### Phase 2: Video & Media Delivery Optimization (Saves ~80-100 MB more)
1. **Leverage YouTube Embeds for Existing Videos**:
   - `bat_dau_vo_van.mp4` (53.47 MB) → Set `videoUrl: ""` in `content.ts` and use existing `youtubeUrl: "https://youtu.be/-1ddyry_Qs0"`. Delete local MP4.
   - `shorts_ftuv04UxKJA.mp4` (20.60 MB) → Use YouTube Shorts embed. Delete local MP4.
   - `lop_k2.mp4` (6.09 MB) → Use existing YouTube embed `WV8rggcgmGA`. Delete local MP4.
2. **Eliminate Autoplay Video Burden in `MetaphorsSection.tsx`**:
   - Replace `<video autoPlay ...>` with high-efficiency poster images + Play button overlay (or animated WebP previews under 150 KB).
   - Clicking opens the video modal on demand, saving **23.5 MB** of network payload during initial page scroll.

#### Phase 3: Image Modernization (WebP / AVIF)
1. Convert the 6 remaining large PNGs to WebP/AVIF (85% quality):
   - `assets/image_1781281916199-DoWUR6eO.png` (1.68 MB) → WebP (~120 KB)
   - `assets/tiktok_nguyenducviet.png` (1.52 MB) → WebP (~140 KB)
   - `assets/image_1781257789234-CGDyQOer.png` (1.26 MB) → WebP (~110 KB)
   - In `CurriculumSection.tsx:34`, switch `src="/assets/events/event_full_class.png"` (899 KB) to `event_full_class.jpg` (207 KB) or convert to WebP (~75 KB).
   - `assets/image_1781281388562-DGSN1Etr.png` (592 KB) → WebP (~80 KB)
   - `assets/fanpage_nguyenducviet.png` (541 KB) → WebP (~65 KB)
   *Expected Image Savings: ~5.5 MB → ~0.6 MB (89% reduction).*

#### Phase 4: Code Splitting & Caching Strategy
1. **Dynamic Import for Modals and Secondary Pages**:
   - In `src/App.tsx`:
     ```tsx
     const SuccessPage = React.lazy(() => import('./pages/SuccessPage').then(m => ({ default: m.SuccessPage })));
     const RegisterModal = React.lazy(() => import('./components/RegisterModal').then(m => ({ default: m.RegisterModal })));
     ```
2. **Rollup Manual Chunks in `vite.config.ts`**:
   ```ts
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           'vendor-react': ['react', 'react-dom'],
           'vendor-icons': ['lucide-react'],
         }
       }
     }
   }
   ```
   *Benefit*: Separates immutable React runtime (gzipped ~48 KB) from application content chunks, allowing browsers to cache React indefinitely across content revisions.

#### Phase 5: Tailwind Build-Time Migration & Font Consolidation
1. Replace runtime Tailwind CDN (`cdn.tailwindcss.com`) with `@tailwindcss/vite` or standard PostCSS tailwind build.
2. Remove external CDN links to Google Fonts / cdnfonts in `index.html` and standardize on local WOFF2 webfonts to eliminate render-blocking external DNS and TLS handshakes.

---

## 5. Verification Method

To independently reproduce and verify all metrics and findings:

1. **Verify TypeScript Compilation**:
   ```bash
   cd /Users/vietmac/Documents/CODE/offline
   npm run typecheck
   # Expected: Exits with code 0, 0 errors
   ```

2. **Verify Build Output and Bundle Sizes**:
   ```bash
   cd /Users/vietmac/Documents/CODE/offline
   npm run build
   # Measure exact bytes:
   node -e "
   const fs = require('fs');
   const zlib = require('zlib');
   const dir = 'dist/assets';
   for (const f of fs.readdirSync(dir)) {
     if (f.endsWith('.js') || f.endsWith('.css')) {
       const buf = fs.readFileSync(dir + '/' + f);
       console.log(f, 'Raw:', (buf.length/1024).toFixed(2) + ' KB', 'Gzip:', (zlib.gzipSync(buf).length/1024).toFixed(2) + ' KB');
     }
   }
   "
   # Expected: JS Gzip < 120 KB (currently 96.09 KB)
   ```

3. **Verify Asset Audit & Dead File Count**:
   ```bash
   cd /Users/vietmac/Documents/CODE/offline
   node .agents/explorer_survey_2/scan_assets.js
   # Expected: 116 public files, 322.74 MB total, 51 unreferenced files totaling 90.72 MB
   ```

4. **Invalidation Conditions**:
   - If any new image or video is added to `public/` without being referenced in `content.ts` or TSX, unreferenced asset count will increase.
   - If `src/content.ts` or sections import additional heavy dependencies (e.g. video player libraries, heavy animation suites), check if JS gzip exceeds 120 KB.
