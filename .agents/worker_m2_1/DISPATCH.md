## 2026-09-04T01:27:18Z
You are Worker M2 (worker_m2_1) implementing Milestone M2: Performance Optimization & Source Cleanup.
Working directory: /Users/vietmac/Documents/CODE/offline/.agents/worker_m2_1/
Project root: /Users/vietmac/Documents/CODE/offline

Reference files:
- /Users/vietmac/Documents/CODE/offline/.agents/ORIGINAL_REQUEST.md
- /Users/vietmac/Documents/CODE/offline/PROJECT.md
- /Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_2/handoff.md
- /Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_2/scan_assets.js

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Scope & Write Ownership:
- You own: deletion of dead unreferenced assets in `public/` and root draft markdown file.
- CRITICAL PRESERVATION: DO NOT delete `public/opengraph.jpg`, `public/robots.txt`, or `public/favicon.svg` (required for SEO & M3).
- Do NOT touch `api/` or modify component code unnecessarily.

Tasks:
1. Review the asset catalog in `.agents/explorer_survey_2/handoff.md` section 1.4.
   Prune the 51 unreferenced dead assets (~90.72 MB):
   a. Delete entire `public/gifs/` directory (6 files, 40.92 MB).
   b. Delete 5 unreferenced videos in `public/assets/lighting/` and `public/assets/formats/`:
      - `public/assets/lighting/light_ulanzi_aida.mp4`
      - `public/assets/lighting/light_talkinghead.mp4`
      - `public/assets/lighting/light_podcast_dt.mp4`
      - `public/assets/lighting/light_2den_spotlight.mp4`
      - `public/assets/formats/ai_miss_vlog_ngat_nhip.mp4`
   c. Delete unreferenced/duplicate Pain PNGs in `public/assets/pain/` and `public/assets/image_1782*.png` cataloged in section 1.4:
      - `public/assets/image_1782204137757-B_GzSTh2.png` & `public/assets/pain/lam_deu_video.png`
      - `public/assets/image_1782119991688-CzFs1kB-.png` & `public/assets/pain/lan_man_kich_ban.png`
      - `public/assets/image_1782189176146-dnh32Fxr.png` & `public/assets/pain/chua_chuyen_nghiep.png`
      - `public/assets/image_1782111290168-91rX6BTq.png` & `public/assets/pain/bi_y_len_hinh.png`
   d. Delete draft/duplicate images in `public/assets/`:
      - `gif2_opt-CAxvnZZj.webp`, `gif3_opt-BENmiLaC.webp`, `gif4_opt-CoJcWNzO.webp`
      - Numbered unreferenced PNGs: `image_1781192238334-CSmHQDZt.png`, `image_1781259464562-cWhsbWKV.png`, `image_1781259495026-yBmDnAJ1.png`, `image_1782111083758-D1lt1pEb.png`, `fanpage_real_38k.png`
      - 6 mockup cards in `public/assets/showcase/option*.jpg`
      - Unused showcase photos: `halona.jpg`, `thuy.jpg`, `nguyet.jpg`, `disneyland.jpg`
      - `feedback_hocvien_nganh_phan_bon_chot_nhanh.png`, `instructor.jpg`, `offline2_opt-C2pqlP8_.webp`
      - `public/.DS_Store`
   e. Delete root draft documentation file: `tong-hop-logic-3-tang-va-kich-ban-4-buoc.md`.
2. Run `.agents/explorer_survey_2/scan_assets.js` to verify asset count and confirm that remaining assets are referenced.
3. Run verification:
   - `npm run typecheck` (must pass with 0 errors)
   - `npm run build` (must pass with 0 errors)
   - Verify bundle size: measure `dist/assets/index-*.js` raw and gzip bytes. Gzip MUST be < 120 KB.
   - `node tests/e2e/runner.mjs` (must pass 99/99 active tests)
4. Document all deleted files, before/after folder sizes, and build verification outputs in `/Users/vietmac/Documents/CODE/offline/.agents/worker_m2_1/handoff.md`.
Notify parent via send_message when complete.
