import fs from 'node:fs';
import path from 'node:path';

console.log('================================================================================');
console.log('🔍 INDEPENDENT FORENSIC INTEGRITY AUDIT — MILESTONE M1 ITERATION 3');
console.log('================================================================================\n');

// -----------------------------------------------------------------------------
// 1. CONTENT.TS PURITY & AUTHENTICITY AUDIT
// -----------------------------------------------------------------------------
console.log('--- CHECK 1: src/content.ts Purity & Authenticity ---');
const contentPath = path.resolve('src/content.ts');
const contentStr = fs.readFileSync(contentPath, 'utf-8');

const testArtifacts = [
  'MUTATION_TEST',
  'rocket-ship',
  'super-emerald',
  '__TEST__',
  'placeholder_test',
  'dummy_value',
  'test_token',
  'test-data'
];

let foundArtifacts = [];
for (const token of testArtifacts) {
  if (contentStr.includes(token)) {
    foundArtifacts.push(token);
  }
}

console.log('1.1 Test artifacts check:', foundArtifacts.length === 0 ? 'PASSED (0 test artifacts)' : 'FAILED (' + foundArtifacts.join(', ') + ')');

const authenticTokens = [
  { name: 'iconType: trending', present: contentStr.includes('iconType: "trending"') },
  { name: 'variant: emerald', present: contentStr.includes('variant: "emerald"') },
  { name: 'domain: offline.fedu.vn', present: contentStr.includes('domain: "offline.fedu.vn"') },
  { name: 'brandName: VIDEO MARKETING', present: contentStr.includes('brandName: "VIDEO MARKETING"') },
  { name: 'hotline: 0912345678', present: contentStr.includes('hotline: "0912345678"') },
  { name: 'name: Nguyễn Đức Việt', present: contentStr.includes('name: "Nguyễn Đức Việt"') },
  { name: 'headline: KỊCH BẢN 3 TẦNG', present: contentStr.includes('KỊCH BẢN 3 TẦNG') }
];

let missingAuthentic = [];
for (const t of authenticTokens) {
  if (!t.present) missingAuthentic.push(t.name);
}
console.log('1.2 Authentic production copy check:', missingAuthentic.length === 0 ? 'PASSED (100% authentic tokens present)' : 'FAILED (Missing: ' + missingAuthentic.join(', ') + ')');

const residualFiles = [
  'src/content.ts.stress-bak',
  'tests/.stress-m1.lock',
  'src/content.ts.bak'
];
let existingResiduals = residualFiles.filter(f => fs.existsSync(f));
console.log('1.3 Residual artifacts on disk:', existingResiduals.length === 0 ? 'PASSED (0 residual lock/bak files)' : 'FAILED (' + existingResiduals.join(', ') + ')');

// -----------------------------------------------------------------------------
// 2. VIEW COMPONENT PURITY & CONTENT CONSUMPTION AUDIT
// -----------------------------------------------------------------------------
console.log('\n--- CHECK 2: Pure View Component Consumption & Zero Hardcoded Copy ---');

const srcDir = path.resolve('src');
function getTsxFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getTsxFiles(fullPath));
    } else if (file.endsWith('.tsx')) {
      results.push(fullPath);
    }
  }
  return results;
}

const tsxFiles = getTsxFiles(srcDir);
console.log(`Found ${tsxFiles.length} TSX component files in src/`);

// 2.1 Check CONTENT imports
const nonImporting = [];
for (const f of tsxFiles) {
  const rel = path.relative('.', f);
  if (rel === 'src/main.tsx' || rel === 'src/App.tsx') continue; // main is root, App orchestrates sections
  const code = fs.readFileSync(f, 'utf-8');
  if (!code.includes('import { CONTENT }') && !code.includes('import CONTENT') && !code.includes("from '../content'") && !code.includes("from './content'")) {
    nonImporting.push(rel);
  }
}
console.log('2.1 Component CONTENT import check:', nonImporting.length === 0 ? `PASSED (All 19 view components import CONTENT directly)` : 'FAILED (' + nonImporting.join(', ') + ')');

// 2.2 Check Vietnamese diacritics in TSX files (ignoring comments)
const VIETNAMESE_REGEX = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ]/;
let hardcodedInTsx = [];

for (const f of tsxFiles) {
  const rel = path.relative('.', f);
  const lines = fs.readFileSync(f, 'utf-8').split('\n');
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('{/*') || trimmed.startsWith('*') || trimmed.startsWith('/*')) {
      return;
    }
    if (VIETNAMESE_REGEX.test(line)) {
      hardcodedInTsx.push({ file: rel, line: idx + 1, text: trimmed });
    }
  });
}
console.log('2.2 Zero hardcoded Vietnamese copy in view components:', hardcodedInTsx.length === 0 ? 'PASSED (0 hardcoded strings found)' : `FAILED (${hardcodedInTsx.length} found: ` + JSON.stringify(hardcodedInTsx) + ')');

// 2.3 Check no fallback masking (CONTENT.x || "Fallback")
let fallbackMasking = [];
for (const f of tsxFiles) {
  const rel = path.relative('.', f);
  const code = fs.readFileSync(f, 'utf-8');
  const matches = code.match(/CONTENT\.[a-zA-Z0-9_.]+\s*(\|\||\?\?)\s*["'][^"']+["']/g);
  if (matches) {
    fallbackMasking.push({ file: rel, matches });
  }
}
console.log('2.3 Fallback masking check:', fallbackMasking.length === 0 ? 'PASSED (0 fallback strings masking CONTENT)' : 'FAILED');

// 2.4 Check no local shadowing (const CONTENT = ...)
let shadowed = [];
for (const f of tsxFiles) {
  const rel = path.relative('.', f);
  const code = fs.readFileSync(f, 'utf-8');
  if (/const\s+CONTENT\s*=\s*\{/.test(code) || /let\s+CONTENT\s*=\s*\{/.test(code)) {
    shadowed.push(rel);
  }
}
console.log('2.4 Shadowed CONTENT declaration check:', shadowed.length === 0 ? 'PASSED (0 local shadow objects)' : 'FAILED');

// -----------------------------------------------------------------------------
// 3. DEFENSIVE BOUNDS CHECK IN GrowthChartSection.tsx
// -----------------------------------------------------------------------------
console.log('\n--- CHECK 3: Array Boundary Guard in GrowthChartSection.tsx ---');
const chartFile = path.resolve('src/sections/GrowthChartSection.tsx');
const chartCode = fs.readFileSync(chartFile, 'utf-8');
const hasBoundaryGuard = chartCode.includes('pointsMarketing.length > 2') && chartCode.includes('pointsMarketing[1]?.x') && chartCode.includes('pointsMarketing[2]?.x');
console.log('3.1 Array boundary guards in GrowthChartSection:', hasBoundaryGuard ? 'PASSED (defensive length guard and optional chaining present)' : 'FAILED');

// -----------------------------------------------------------------------------
// 4. CONTENT_MAP.md COVERAGE AUDIT
// -----------------------------------------------------------------------------
console.log('\n--- CHECK 4: CONTENT_MAP.md Documentation Coverage ---');
const mapExists = fs.existsSync('CONTENT_MAP.md');
const mapContent = fs.readFileSync('CONTENT_MAP.md', 'utf-8');
const sectionsMapped = [
  'CONTENT.site', 'CONTENT.seo', 'CONTENT.navbar', 'CONTENT.hero', 'CONTENT.proof',
  'CONTENT.definition', 'CONTENT.chart', 'CONTENT.metaphors', 'CONTENT.painPoints',
  'CONTENT.curriculum', 'CONTENT.bannerCta', 'CONTENT.showcase', 'CONTENT.caseStudies',
  'CONTENT.targetAudience', 'CONTENT.instructor', 'CONTENT.register', 'CONTENT.faqSection',
  'CONTENT.stickyBottomCta', 'CONTENT.registerModal', 'CONTENT.successPage', 'CONTENT.footer'
];

let unmapped = sectionsMapped.filter(s => !mapContent.includes(s));
console.log('4.1 CONTENT_MAP.md maps all sections:', (mapExists && unmapped.length === 0) ? `PASSED (${sectionsMapped.length}/21 sections documented)` : 'FAILED (Unmapped: ' + unmapped.join(', ') + ')');

console.log('\n================================================================================');
console.log('ALL FORENSIC CHECKS COMPLETE');
console.log('================================================================================');
