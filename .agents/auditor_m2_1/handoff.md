# Forensic Audit Report & Handoff: Milestone M2 — Performance Optimization & Source Cleanup

**Auditor**: `auditor_m2_1`  
**Role**: Forensic Auditor (critic, specialist, auditor)  
**Date**: 2026-09-04T08:35:45+07:00  
**Working Directory**: `/Users/vietmac/Documents/CODE/offline/.agents/auditor_m2_1/`  
**Project Root**: `/Users/vietmac/Documents/CODE/offline`  
**Work Product**: Milestone M2 (Asset Pruning, Essential File Preservation, Build Authenticity, Bundle Budget)  
**Profile**: General Project (Development Integrity Mode per `ORIGINAL_REQUEST.md`)  
**Verdict**: **CLEAN**

---

## Forensic Audit Summary

| Check # | Forensic Check Name | Status | Observed Value / Finding |
|---|---|---|---|
| Check 1 | Genuine Asset Deletion (50 files, ~90.65 MB) | **PASS** | 50/50 dead files deleted from repo; 0 remain in original paths |
| Check 2 | Hidden Directory & Stash Avoidance | **PASS** | 0 files stashed in hidden dirs; `.agents/` contains only metadata |
| Check 3 | Duplicate Asset Elimination | **PASS** | 0 duplicate asset pairs remaining in `public/` (6 pairs purged) |
| Check 4 | Essential File Preservation | **PASS** | `opengraph.jpg` (81,793B JPEG), `robots.txt` (86B), `favicon.svg` (2,656B SVG) fully intact |
| Check 5 | TypeScript Compilation (`npm run typecheck`) | **PASS** | Exit code 0, 0 errors, full type integrity |
| Check 6 | Vite Production Build (`npm run build`) | **PASS** | Exit code 0, 1852 modules transformed, real bundle generated |
| Check 7 | Bundle Size Budget (< 120 KB gzip) | **PASS** | Main JS: 342,351 B raw, 96,108 B gzip (~96.11 KB / 93.86 KiB), ~24 KB buffer |
| Check 8 | Logic Authenticity & Anti-Facade Verification | **PASS** | 0 facades; full React runtime, Lucide icons, 14 sections & `CONTENT` strings active |
| Check 9 | Opaque-box E2E Test Suite Execution | **PASS** | 99/99 active tests passed, 0 failures, 2 skipped (101 total) |

---

## 1. Observation

### 1.1 Dead Assets Deletion Verification (Empirical Check)
Tool execution: Checked existence of all 50 dead/unreferenced assets claimed in `worker_m2_1/handoff.md`:
```
Total deleted files checked: 50
Remaining files found in original paths: 0
```
Specifically confirmed genuine deletion of:
1. `public/gifs/` (entire directory deleted, 6 files, 42,906,698 B):
   - `public/gifs/lighting-art.gif` (9,851,923 B)
   - `public/gifs/shot-sizes.gif` (8,338,255 B)
   - `public/gifs/spatial-direction.gif` (8,078,030 B)
   - `public/gifs/mechanical-cut.gif` (7,615,821 B)
   - `public/gifs/lighting-3d.gif` (6,008,603 B)
   - `public/gifs/invisible-cut.gif` (3,016,066 B)
2. Unused videos in `lighting/` and `formats/` (5 files, 23,363,965 B):
   - `public/assets/lighting/light_ulanzi_aida.mp4` (6,261,235 B)
   - `public/assets/lighting/light_talkinghead.mp4` (4,734,060 B)
   - `public/assets/lighting/light_podcast_dt.mp4` (4,719,543 B)
   - `public/assets/formats/ai_miss_vlog_ngat_nhip.mp4` (4,224,566 B)
   - `public/assets/lighting/light_2den_spotlight.mp4` (3,424,561 B)
3. Duplicate & unreferenced pain point PNGs (`public/assets/pain/` directory completely deleted, 8 files, 21,034,872 B):
   - `public/assets/image_1782204137757-B_GzSTh2.png` & `public/assets/pain/lam_deu_video.png` (2,797,786 B each)
   - `public/assets/image_1782119991688-CzFs1kB-.png` & `public/assets/pain/lan_man_kich_ban.png` (2,717,684 B each)
   - `public/assets/image_1782189176146-dnh32Fxr.png` & `public/assets/pain/chua_chuyen_nghiep.png` (2,591,431 B each)
   - `public/assets/image_1782111290168-91rX6BTq.png` & `public/assets/pain/bi_y_len_hinh.png` (2,410,535 B each)
4. Draft images, mockups, posters, duplicate webp/png assets (30 files, 7,736,512 B):
   - `public/assets/gif4_opt-CoJcWNzO.webp` (864,082 B), `gif3_opt-BENmiLaC.webp` (636,000 B), `gif2_opt-CAxvnZZj.webp` (473,902 B)
   - `public/assets/fanpage_real_38k.png` (554,055 B), `public/assets/events/event_full_class.jpg` (211,919 B)
   - Showcase options (`option1_linear_card.jpg`, `option2_cach*.jpg`, `option3_split_banner.jpg`, `disneyland.jpg`, `halona.jpg`, `nguyet.jpg`, `thuy.jpg`)
   - Lighting posters (`light_ulanzi_aida.jpg`, `light_podcast_dt.jpg`)
   - `public/feedback_hocvien_nganh_phan_bon_chot_nhanh.png` (133,659 B), `public/instructor.jpg` (81,178 B)
   - `public/assets/offline2_opt-C2pqlP8_.webp` (47,528 B)
   - `public/.DS_Store` (10,244 B)
5. Root draft documentation file (1 file, 14,282 B):
   - `tong-hop-logic-3-tang-va-kich-ban-4-buoc.md` (14,282 B)

### 1.2 Anti-Stash & Layout Compliance Scan
- Tool execution: Searched for all 50 target basenames across the entire project repository (excluding `.git`, `node_modules`, `dist`):
  `Matches found in repo: []` (0 files found).
- Scanned for hidden files/directories:
  Found only `.env`, `.env.local`, and `tests/.stress-m1.lock`. No hidden asset stashes exist.
- Checked `.agents/` directory: All files are markdown (`.md`), patch (`.patch`), or audit scripts (`.mjs`/`.js`). No media assets, source code, or tests are stashed in `.agents/`.
- Verified `.vercel/output/static/gifs`: Generated at 07:47 (prior to M2 start) by an earlier deployment run before cleanup. Ignored by `.gitignore`. Not a worker stash.

### 1.3 Preserved Critical Files Verification
Tool execution: Checked `public/opengraph.jpg`, `public/robots.txt`, and `public/favicon.svg`:
- `public/opengraph.jpg`: Size `81,793` bytes, format: `JPEG image data, JFIF standard 1.01, aspect ratio, density 1x1, segment length 16, baseline, precision 8, 1280x720, components 3`. Genuinely intact.
- `public/robots.txt`: Size `86` bytes, contains:
  ```
  User-agent: *
  Allow: /
  Disallow: /api/

  Sitemap: https://offline.fedu.vn/sitemap.xml
  ```
  Genuinely intact.
- `public/favicon.svg`: Size `2,656` bytes, valid SVG vector markup containing FEDU brand badge, play button, and ambient squircle. Genuinely intact.

### 1.4 Post-Cleanup Asset Audit (`scan_assets.js` & Duplicate Check)
- Tool execution: `node .agents/explorer_survey_2/scan_assets.js`:
  - `Total files in public/: 67` (down from 116, 49 files removed from `public/`).
  - `Total public/ size: 232.10 MB (243,371,193 bytes)` (down from 322.74 MB).
  - `=== DUPLICATES ===`: 0.
  - `=== UNREFERENCED ASSETS IN CODE ===`: Count: 1 (`robots.txt` - required for web crawlers).
  - All 14 remaining MP4 videos and 52 image/font assets are actively referenced in `src/` or `index.html`.
- Tool execution: MD5 duplicate check across all 67 files:
  `Total duplicates found: 0`.

### 1.5 TypeScript Compilation & Build Authenticity
- Tool execution: `npm run typecheck` (`tsc -p tsconfig.json --noEmit`):
  ```
  > 30ngayviral-fedu-vn@1.0.0 typecheck
  > tsc -p tsconfig.json --noEmit

  Exit code: 0
  ```
- Tool execution: `npm run build` (`npx vite@7.3.2 build --config vite.config.ts`):
  ```
  > 30ngayviral-fedu-vn@1.0.0 build
  > npx vite@7.3.2 build --config vite.config.ts

  vite v7.3.2 building client environment for production...
  transforming...
  ✓ 1852 modules transformed.
  rendering chunks...
  computing gzip size...
  dist/index.html                   5.16 kB │ gzip:  1.81 kB
  dist/assets/index-DT9nT6Q4.css   20.93 kB │ gzip:  4.23 kB
  dist/assets/index-BjDZo-M7.js   342.37 kB │ gzip: 96.12 kB
  ✓ built in 1.32s
  Exit code: 0
  ```

### 1.6 Bundle Size & Code Authenticity Verification
- Main JavaScript bundle measurement (`dist/assets/index-*.js`):
  - Raw size: `342,351` bytes (~334.33 KB)
  - Gzip compressed size: `96,108` bytes (`93.86 KiB` / `96.11 KB`)
  - Budget requirement: `< 120 KB`
  - Margin: `23.89 KB` below maximum budget limit.
- Bundle content verification: Confirmed the bundle contains real production code without logic stripping:
  - React 19 runtime (`React`, `jsxRuntime`)
  - Real copy from `src/content.ts` present in bundle:
    - `"Biến Chuyên Môn Của Bạn Thành Video Marketing Đắt Giá"`: present
    - `"GIỮ CHỖ NGAY"`: present
    - `"Lộ Trình 2 Ngày"`: present
    - `"GẶP MẶT TRỰC TIẾP · HÀ NỘI · SĨ SỐ GIỚI HẠN"`: present
    - `"KỊCH BẢN CHUYỂN ĐỔI"`: present
    - `"WORKSHOP OFFLINE 2 NGÀY"`: present
  - `src/` inspection: 0 facade files, 0 dummy classes, 0 dummy functions. All 14 UI sections are mounted in `src/App.tsx`.

### 1.7 E2E Test Suite Execution
- Tool execution: `node tests/e2e/runner.mjs`:
  ```
  ┌────────────────────────────────────────────────────────┬───────┬──────┬──────┬───────┬─────────┐
  │ Test Suite Tier                                        │ Total │ Pass │ Fail │ Skip  │ Time    │
  ├────────────────────────────────────────────────────────┼───────┼──────┼──────┼───────┼─────────┤
  │ Tier 1: Feature Coverage (F1 - F12)                    │    60 │   58 │    0 │     2 │  5729ms │
  │ Tier 2: Boundary & Corner Cases                        │    25 │   25 │    0 │     0 │    22ms │
  │ Tier 3: Cross-Feature Combinations                     │     7 │    7 │    0 │     0 │    15ms │
  │ Tier 4: Real-World Application Scenarios               │     9 │    9 │    0 │     0 │     3ms │
  ├────────────────────────────────────────────────────────┼───────┼──────┼──────┼───────┼─────────┤
  │ TOTAL COMBINED E2E EXECUTION                           │   101 │   99 │    0 │     2 │  5771ms │
  └────────────────────────────────────────────────────────┴───────┴──────┴──────┴───────┴─────────┘

  🎉 RESULT: ALL 99 E2E TESTS PASSED SUCCESSFULLY in 5771ms!
  ```

---

## 2. Logic Chain

1. **Dead Assets Removal Integrity [Observation 1.1, 1.2, 1.4]**:
   - The worker claimed the deletion of 50 dead/unreferenced assets (~90.65 MB).
   - Independent verification confirmed 0 of the 50 files remain in their original paths.
   - Comprehensive repository searches confirmed none of the files were stashed, renamed, or relocated into hidden directories or `.agents/`.
   - All 6 pairs of MD5 duplicates identified in the baseline survey were eliminated (0 duplicate pairs remain).
   - Therefore, the asset pruning was genuine, permanent, and complete.

2. **Asset Preservation Integrity [Observation 1.3, 1.4]**:
   - `ORIGINAL_REQUEST.md` (R3) and project specifications require `opengraph.jpg`, `robots.txt`, and `favicon.svg` to be maintained for SEO and brand integrity.
   - All 3 files were verified to exist with non-zero size, valid formats, and valid contents.
   - Therefore, essential assets were strictly preserved.

3. **Build Authenticity Integrity [Observation 1.5, 1.6]**:
   - `npm run typecheck` runs genuine TypeScript compilation (`tsc -p tsconfig.json --noEmit`) and returned exit code 0.
   - `npm run build` runs genuine Vite 7.3.2 compilation (`npx vite build --config vite.config.ts`), transforming 1852 modules into production assets without error.
   - Inspection of `dist/assets/index-*.js` confirmed real compiled React 19 code, full view components, and actual Vietnamese content strings from `src/content.ts`.
   - Therefore, the build pipeline is genuine, and no facades or prefabricated bundles were used.

4. **Bundle Budget Compliance [Observation 1.6, 1.7]**:
   - The required threshold from `ORIGINAL_REQUEST.md` (R2) is main JS bundle gzip `< 120 KB`.
   - Direct measurement with Node.js `zlib.gzipSync` confirmed the main bundle is `96,108` bytes (`96.11 KB`), providing ~24 KB of headroom.
   - Git diff analysis confirmed no components or UI logic were deleted or gutted to achieve this number; the bundle size is the natural outcome of clean code and tree-shaking.
   - Therefore, the bundle budget requirement is fully satisfied.

---

## 3. Caveats

- **Active Video Payload in `public/assets/`**:
  14 MP4 files remain in `public/` totaling ~219.21 MB. All 14 files are actively referenced in `src/content.ts` (none are dead assets). In `tests/e2e/tier1-features.test.mjs`, tests F5.1 and F5.5 have conditional skips because the test harness author anticipated potential future video re-encoding or CDN migration in Milestone M5. This does not violate Milestone M2 requirements, which explicitly target dead/unused asset pruning.
- No other caveats.

---

## 4. Conclusion

Milestone M2 (Performance Optimization & Source Cleanup) has been independently audited and empirically verified against all acceptance criteria:
- **~90.65 MB (95,056,329 B) of dead assets genuinely pruned** across 50 files; 0 stashed.
- **Critical SEO and branding assets (`opengraph.jpg`, `robots.txt`, `favicon.svg`) genuinely preserved**.
- **`npm run typecheck` and `npm run build` execute with 0 errors**.
- **Main JS bundle gzip is 96.11 KB**, strictly within the `< 120 KB` budget limit with no logic stripped.
- **E2E test suite passes 99/99 active tests (100% pass rate)**.

### Verdict
**`CLEAN`**

---

## 5. Verification Method

To independently re-verify the forensic audit findings:

1. **Verify Asset Cleanliness and 0 Duplicates**:
   ```bash
   cd /Users/vietmac/Documents/CODE/offline
   node .agents/explorer_survey_2/scan_assets.js
   ```
   *Expected*: Total files in `public/`: 67; Duplicates: 0; Unreferenced assets: 1 (`robots.txt`).

2. **Verify Preserved Files**:
   ```bash
   file public/opengraph.jpg public/favicon.svg public/robots.txt
   ```
   *Expected*: All three files exist with valid image/text MIME types.

3. **Verify TypeScript & Production Build**:
   ```bash
   npm run typecheck
   npm run build
   ```
   *Expected*: Exit code 0, 0 errors.

4. **Verify Gzip Bundle Size Budget**:
   ```bash
   node -e "
   const fs = require('fs'), zlib = require('zlib'), path = require('path');
   const dir = 'dist/assets';
   for (const f of fs.readdirSync(dir)) {
     if (f.startsWith('index-') && f.endsWith('.js')) {
       const gz = zlib.gzipSync(fs.readFileSync(path.join(dir, f))).length / 1024;
       console.log(f, gz.toFixed(2) + ' KB', gz < 120 ? 'PASS' : 'FAIL');
     }
   }
   "
   ```
   *Expected*: Bundle size < 120 KB (observed: ~96.11 KB).

5. **Verify E2E Suite**:
   ```bash
   node tests/e2e/runner.mjs
   ```
   *Expected*: 99 pass, 0 fail, 2 skip.
