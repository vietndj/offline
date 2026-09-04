# Dispatch for Explorer Survey 2: Performance, Bundle & Source Cleanup

## Objective
Investigate the build setup, asset footprint, and bundle performance of offline.fedu.vn to prepare for R2 (Performance Optimization & Source Cleanup).

## Scope
- Read `/Users/vietmac/Documents/CODE/offline/.agents/ORIGINAL_REQUEST.md`
- Inspect `package.json`, `vite.config.ts`, `tsconfig.json`
- Run/check `npm run typecheck` and `npm run build` to inventory all current errors, warnings, and bundle outputs
- Measure bundle size (main JS bundle uncompressed and gzipped vs the < 120KB target)
- Scan repository (especially `public/`, `src/assets/`, root) for unused media, large images, videos, drafts, or duplicate files
- Propose concrete optimization strategy: code splitting, lazy loading, tree-shaking, asset cleanup/compression

## Output
Write your comprehensive analysis and handoff report to:
`/Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_2/handoff.md`
And update `/Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_2/progress.md`

## 2026-09-04T00:37:23Z
You are Explorer 2 for the offline.fedu.vn optimization project.
Your working directory is: /Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_2/
Your task is to thoroughly survey the Build, Bundle Performance, and Asset Footprint:
1. Inspect `package.json`, `vite.config.ts`, `tsconfig.json`, and run/inspect `npm run typecheck` and `npm run build`.
2. Measure the current bundle size (uncompressed and gzipped) for JS and CSS, specifically checking whether main JS gzip is < 120KB.
3. Search for unused media files, drafts, oversized assets in `public/`, `src/assets/`, or root.
4. Recommend concrete optimization techniques (code splitting, tree-shaking, lazy-loading heavy media, asset pruning).
5. Maintain your `progress.md` with timestamps.
6. Write your comprehensive report to `/Users/vietmac/Documents/CODE/offline/.agents/explorer_survey_2/handoff.md`.
7. Once finished, send a message to parent informing completion.
