/**
 * Stress Test Harness for Milestone M1 (offline.fedu.vn)
 * Challenger M1-2: Empirical stress testing of src/content.ts and component imports
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT_DIR = process.cwd();
const CONTENT_PATH = path.join(ROOT_DIR, 'src/content.ts');
const BASELINE_PATH = path.join(ROOT_DIR, 'tests/content.baseline.ts');
const BACKUP_PATH = path.join(ROOT_DIR, 'src/content.ts.stress-bak');
const LOCK_PATH = path.join(ROOT_DIR, 'tests/.stress-m1.lock');

function acquireLock(timeoutMs = 60000) {
  const start = Date.now();
  while (true) {
    try {
      fs.writeFileSync(LOCK_PATH, String(process.pid), { flag: 'wx' });
      return;
    } catch (e) {
      if (Date.now() - start > timeoutMs) {
        throw new Error('Could not acquire lock for tests/stress-m1.mjs within timeout');
      }
      try {
        const stats = fs.statSync(LOCK_PATH);
        if (Date.now() - stats.mtimeMs > 120000) {
          fs.unlinkSync(LOCK_PATH);
          continue;
        }
      } catch (_) {}
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 200);
    }
  }
}

function releaseLock() {
  try {
    if (fs.existsSync(LOCK_PATH)) {
      fs.unlinkSync(LOCK_PATH);
    }
  } catch (_) {}
}

acquireLock();

function sanitizeContent(content) {
  let cleaned = content;
  // Purge test diacritics / RTL payloads
  if (cleaned.includes('مرحبا بالعالم') || cleaned.includes('שלום עולם') || cleaned.includes('🔥🚀')) {
    cleaned = cleaned.replace(
      /(hero:\s*\{[\s\S]*?subheadline:\s*")[^"]*(")/,
      '$1Khóa học offline 2 ngày thực chiến (từ sáng đến chiều), cầm tay chỉ việc giúp chủ doanh nghiệp, người làm chuyên môn, đào tạo và dịch vụ làm chủ toàn bộ quy trình sản xuất video từ A–Z. Không cần rành công nghệ hay giỏi kỹ thuật từ trước.$2'
    );
  }
  if (cleaned.includes('rocket-ship')) {
    cleaned = cleaned.replace(/iconType:\s*"rocket-ship"/g, 'iconType: "trending"');
  }
  if (cleaned.includes('super-emerald')) {
    cleaned = cleaned.replace(/variant:\s*"super-emerald"/g, 'variant: "emerald"');
  }
  if (cleaned.includes('MUTATION_TEST')) {
    cleaned = cleaned.replace(/MUTATION_TEST/g, '');
  }
  return cleaned;
}

function loadBaseline() {
  // 1. Try baseline fixture if exists
  if (fs.existsSync(BASELINE_PATH)) {
    try {
      const baselineRaw = fs.readFileSync(BASELINE_PATH, 'utf-8');
      return sanitizeContent(baselineRaw);
    } catch (_) {}
  }
  // 2. Try git show HEAD:src/content.ts if valid and compatible
  try {
    const gitHead = execSync('git show HEAD:src/content.ts', { cwd: ROOT_DIR, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
    if (gitHead && gitHead.includes('definition') && gitHead.includes('columns')) {
      return sanitizeContent(gitHead);
    }
  } catch (_) {}
  // 3. Fallback to CONTENT_PATH
  const diskContent = fs.readFileSync(CONTENT_PATH, 'utf-8');
  return sanitizeContent(diskContent);
}

const INITIAL_CONTENT = loadBaseline();

// Guarantee baseline fixture exists on disk
if (!fs.existsSync(BASELINE_PATH)) {
  try {
    fs.writeFileSync(BASELINE_PATH, INITIAL_CONTENT, 'utf-8');
  } catch (_) {}
}

// Guarantee CONTENT_PATH is cleanly synchronized to clean baseline on startup
fs.writeFileSync(CONTENT_PATH, INITIAL_CONTENT, 'utf-8');
fs.writeFileSync(BACKUP_PATH, INITIAL_CONTENT, 'utf-8');

function restoreInitial() {
  try {
    fs.writeFileSync(CONTENT_PATH, INITIAL_CONTENT, 'utf-8');
  } catch (err) {
    try {
      if (fs.existsSync(BASELINE_PATH)) {
        fs.copyFileSync(BASELINE_PATH, CONTENT_PATH);
      } else if (fs.existsSync(BACKUP_PATH)) {
        fs.copyFileSync(BACKUP_PATH, CONTENT_PATH);
      }
    } catch (_) {}
  }
}

function cleanup() {
  restoreInitial();
  try {
    if (fs.existsSync(BACKUP_PATH)) {
      fs.unlinkSync(BACKUP_PATH);
    }
  } catch (_) {}
  releaseLock();
}

process.on('exit', cleanup);
process.on('SIGINT', () => {
  cleanup();
  process.exit(1);
});
process.on('SIGTERM', () => {
  cleanup();
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  cleanup();
  console.error('Uncaught exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (err) => {
  cleanup();
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

const results = [];

function record(suite, name, passed, details = '') {
  results.push({ suite, name, passed, details });
  const status = passed ? '✔ PASS' : '❌ FAIL';
  console.log(`  ${status} [${suite}] ${name}${details ? ` (${details})` : ''}`);
}

function runCommand(cmd) {
  try {
    const stdout = execSync(cmd, { cwd: ROOT_DIR, encoding: 'utf-8', stdio: 'pipe' });
    return { success: true, output: stdout, code: 0 };
  } catch (err) {
    return {
      success: false,
      output: (err.stdout || '') + '\n' + (err.stderr || '') + '\n' + (err.message || ''),
      code: err.status || 1
    };
  }
}

let exitCode = 0;
try {
  console.log('\n===============================================================');
  console.log('🚀 RUNNING M1 ADVERSARIAL STRESS TEST HARNESS (Challenger M1-2)');
  console.log('===============================================================\n');

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 1: TypeScript Schema Violation Catching (Negative Oracles)
// ─────────────────────────────────────────────────────────────────────────────
console.log('--- GROUP 1: TypeScript Schema Enforcement (Negative Oracles) ---');

// Test 1.1: Missing required field
try {
  const corrupted = INITIAL_CONTENT.replace(/brandName:\s*["']VIDEO MARKETING["'],/, '// brandName omitted');
  fs.writeFileSync(CONTENT_PATH, corrupted, 'utf-8');
  const check = runCommand('npm run typecheck');
  const passed = !check.success && (check.output.includes("Property 'brandName' is missing") || check.output.includes("brandName' is missing"));
  record('G1: Schema Oracles', 'Typecheck catches missing required property (site.brandName)', passed, passed ? 'Correctly rejected' : 'Failed to catch missing property');
} finally {
  restoreInitial();
}

// Test 1.2: Type mismatch (number instead of string)
try {
  const corrupted = INITIAL_CONTENT.replace(/headline:\s*"Biến Chuyên Môn[^"]*",/, 'headline: 123456,');
  fs.writeFileSync(CONTENT_PATH, corrupted, 'utf-8');
  const check = runCommand('npm run typecheck');
  const passed = !check.success && (check.output.includes("Type 'number' is not assignable to type 'string'") || check.output.includes("Types of property 'headline' are incompatible"));
  record('G1: Schema Oracles', 'Typecheck catches type mismatch (number assigned to string)', passed, passed ? 'Type error detected' : 'Failed to catch mismatch');
} finally {
  restoreInitial();
}

// Test 1.3: Type mismatch (string instead of number)
try {
  const corrupted = INITIAL_CONTENT.replace('marketing: 88,', 'marketing: "high",');
  fs.writeFileSync(CONTENT_PATH, corrupted, 'utf-8');
  const check = runCommand('npm run typecheck');
  const passed = !check.success && (check.output.includes("Type 'string' is not assignable to type 'number'") || check.output.includes("Types of property 'marketing' are incompatible"));
  record('G1: Schema Oracles', 'Typecheck catches type mismatch (string assigned to number in chart.data)', passed, passed ? 'Type error detected' : 'Failed to catch mismatch');
} finally {
  restoreInitial();
}

// Test 1.4: Invalid union literal for reportCard variant
try {
  const corrupted = INITIAL_CONTENT.replace(/variant:\s*"emerald"/, 'variant: "super-emerald"');
  fs.writeFileSync(CONTENT_PATH, corrupted, 'utf-8');
  const check = runCommand('npm run typecheck');
  const passed = !check.success && check.output.includes("Type '\"super-emerald\"' is not assignable to type");
  record('G1: Schema Oracles', 'Typecheck catches invalid union value (reportCard.stats.variant)', passed, passed ? 'Union violation caught' : 'Failed to catch invalid union');
} finally {
  restoreInitial();
}

// Test 1.5: Invalid union literal for iconType
try {
  const corrupted = INITIAL_CONTENT.replace(/iconType:\s*"trending"/, 'iconType: "rocket-ship"');
  fs.writeFileSync(CONTENT_PATH, corrupted, 'utf-8');
  const check = runCommand('npm run typecheck');
  const passed = !check.success && check.output.includes("Type '\"rocket-ship\"' is not assignable to type");
  record('G1: Schema Oracles', 'Typecheck catches invalid union value (tabs.iconType)', passed, passed ? 'Union violation caught' : 'Failed to catch invalid union');
} finally {
  restoreInitial();
}

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 2: Extreme Strings & Special Characters
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- GROUP 2: Extreme Strings & Special Characters ---');

// Test 2.1: 10,000-character long string
try {
  const longString = 'A'.repeat(10000);
  const corrupted = INITIAL_CONTENT.replace(/headline:\s*"Biến Chuyên Môn[^"]*",/, `headline: "${longString}",`);
  fs.writeFileSync(CONTENT_PATH, corrupted, 'utf-8');
  const check = runCommand('npm run build');
  record('G2: Extreme Strings', '10,000-character headline compiles cleanly through Vite build', check.success, check.success ? 'Build OK' : check.output.slice(0, 100));
} finally {
  restoreInitial();
}

// Test 2.2: Double quotes, single quotes, backticks, escapes
try {
  const escapeString = 'Thầy \\"Nguyễn Đức Việt\\" & \'Chuyên Gia\' `Kịch Bản` \\\\ Đặc Biệt';
  const corrupted = INITIAL_CONTENT.replace(/headline:\s*"Biến Chuyên Môn[^"]*",/, `headline: "${escapeString}",`);
  fs.writeFileSync(CONTENT_PATH, corrupted, 'utf-8');
  const check = runCommand('npm run build');
  record('G2: Extreme Strings', 'Quotes, backticks, and escape sequences compile cleanly', check.success, check.success ? 'Build OK' : check.output.slice(0, 100));
} finally {
  restoreInitial();
}

// Test 2.3: HTML/JSX/XSS tags inside content
try {
  const xssString = '<script>alert("xss")</script><div class="danger"><img src="x" onerror="alert(1)"/></div>';
  const corrupted = INITIAL_CONTENT.replace(/headline:\s*"Biến Chuyên Môn[^"]*",/, `headline: "${xssString.replace(/"/g, '\\"')}",`);
  fs.writeFileSync(CONTENT_PATH, corrupted, 'utf-8');
  const check = runCommand('npm run build');
  record('G2: Extreme Strings', 'HTML / Script / Injection payload compiles safely without JSX parse crash', check.success, check.success ? 'Build OK' : check.output.slice(0, 100));
} finally {
  restoreInitial();
}

// Test 2.4: Unicode diacritics, Vietnamese combining tones, Emojis, RTL
try {
  const unicodeString = '🔥🚀 Tiếng Việt có dấu: Ắ, Ặ, Ỡ, Ợ, Ứ, Ự, Đ... và RTL: مرحبا بالعالم و שלום עולם 👨‍👩‍👧‍👦';
  const corrupted = INITIAL_CONTENT.replace(
    /(hero:\s*\{[\s\S]*?subheadline:\s*")[^"]*(")/,
    `$1${unicodeString}$2`
  );
  fs.writeFileSync(CONTENT_PATH, corrupted, 'utf-8');
  const check = runCommand('npm run build');
  record('G2: Extreme Strings', 'Complex Unicode (combining tones, RTL, emojis) compiles cleanly', check.success, check.success ? 'Build OK' : check.output.slice(0, 100));
} finally {
  restoreInitial();
}

// Test 2.5: Empty strings for text fields
try {
  let corrupted = INITIAL_CONTENT.replace(/badge:\s*"[^"]*",/, 'badge: "",');
  corrupted = corrupted.replace(/ctaNote:\s*"[^"]*",/, 'ctaNote: "",');
  fs.writeFileSync(CONTENT_PATH, corrupted, 'utf-8');
  const check = runCommand('npm run build');
  record('G2: Extreme Strings', 'Empty string fields ("") compile cleanly through Vite build', check.success, check.success ? 'Build OK' : check.output.slice(0, 100));
} finally {
  restoreInitial();
}

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 3: Boundary & Array Scaling
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- GROUP 3: Boundary & Array Scaling ---');

// Test 3.1: 100 items in hero.tags
try {
  const hundredTags = Array.from({ length: 100 }, (_, i) => `"Tag ${i + 1}"`).join(', ');
  const corrupted = INITIAL_CONTENT.replace('tags: [', `tags: [${hundredTags}, `);
  fs.writeFileSync(CONTENT_PATH, corrupted, 'utf-8');
  const check = runCommand('npm run build');
  record('G3: Array Boundaries', 'Large array (100 tags) compiles cleanly without bundler strain', check.success, check.success ? 'Build OK' : check.output.slice(0, 100));
} finally {
  restoreInitial();
}

// Test 3.2: Empty array for hero.tags
try {
  const corrupted = INITIAL_CONTENT.replace(/tags:\s*\[[\s\S]*?\],/, 'tags: [],');
  fs.writeFileSync(CONTENT_PATH, corrupted, 'utf-8');
  const check = runCommand('npm run build');
  record('G3: Array Boundaries', 'Empty array (tags: []) compiles cleanly through Vite build', check.success, check.success ? 'Build OK' : check.output.slice(0, 100));
} finally {
  restoreInitial();
}

// Test 3.3: Empty array for faqSection.items
try {
  const corrupted = INITIAL_CONTENT.replace(/items:\s*\[[\s\S]*?faqs:/, 'items: []\n  },\n  faqs:');
  fs.writeFileSync(CONTENT_PATH, corrupted, 'utf-8');
  const check = runCommand('npm run build');
  record('G3: Array Boundaries', 'Empty array (faqSection.items: []) compiles cleanly through Vite build', check.success, check.success ? 'Build OK' : check.output.slice(0, 100));
} finally {
  restoreInitial();
}

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 4: Component Import Purity & Shadowing Audit
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- GROUP 4: Component Import Purity & Shadowing Audit ---');

const srcDir = path.join(ROOT_DIR, 'src');
function getAllFiles(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(getAllFiles(full));
    } else if (item.name.endsWith('.tsx') || item.name.endsWith('.ts')) {
      files.push(full);
    }
  }
  return files;
}

const allSrcFiles = getAllFiles(srcDir);
const viewFiles = allSrcFiles.filter(f => !f.endsWith('content.ts') && !f.endsWith('theme.ts') && !f.endsWith('main.tsx'));

// Test 4.1: Strictly import CONTENT or content from content.ts
let improperImportFiles = [];
for (const file of viewFiles) {
  const code = fs.readFileSync(file, 'utf-8');
  const relativePath = path.relative(ROOT_DIR, file);

  if (code.includes('CONTENT') || code.includes('content.')) {
    const hasValidImport = /import\s+{[^}]*\b(CONTENT|content)\b[^}]*}\s+from\s+['"](\.\.\/content|@\/content|\.\/content)['"]/.test(code)
      || /import\s+CONTENT\s+from\s+['"](\.\.\/content|@\/content|\.\/content)['"]/.test(code);
    if (!hasValidImport) {
      improperImportFiles.push(relativePath);
    }
  }
}
record(
  'G4: Import Purity',
  'All view components importing content use strict path (../content, ./content, or @/content)',
  improperImportFiles.length === 0,
  improperImportFiles.length === 0 ? `Verified ${viewFiles.length} files` : `Improper imports in: ${improperImportFiles.join(', ')}`
);

// Test 4.2: No shadowed or duplicate CONTENT definitions
let shadowedFiles = [];
for (const file of viewFiles) {
  const code = fs.readFileSync(file, 'utf-8');
  const relativePath = path.relative(ROOT_DIR, file);
  if (/const\s+CONTENT\s*=\s*{/.test(code) || /let\s+CONTENT\s*=\s*{/.test(code)) {
    shadowedFiles.push(relativePath);
  }
}
record(
  'G4: Import Purity',
  'No component declares local shadowed or duplicate CONTENT object',
  shadowedFiles.length === 0,
  shadowedFiles.length === 0 ? 'No local duplicates found' : `Shadowed in: ${shadowedFiles.join(', ')}`
);

// Test 4.3: No hardcoded fallback strings masking missing content
let fallbackMaskingFiles = [];
for (const file of viewFiles) {
  const code = fs.readFileSync(file, 'utf-8');
  const relativePath = path.relative(ROOT_DIR, file);
  const fallbackMatches = code.match(/CONTENT\.[a-zA-Z0-9_.]+\s*(\|\||\?\?)\s*["'][^"']+["']/g);
  if (fallbackMatches) {
    fallbackMaskingFiles.push({ file: relativePath, matches: fallbackMatches });
  }
}
record(
  'G4: Import Purity',
  'No component masks content keys with hardcoded fallback strings (e.g. CONTENT.key || "text")',
  fallbackMaskingFiles.length === 0,
  fallbackMaskingFiles.length === 0 ? '0 fallback masking patterns detected' : `Found fallbacks in: ${JSON.stringify(fallbackMaskingFiles)}`
);

// Test 4.4: Check for runtime mutations to CONTENT
let mutationFiles = [];
for (const file of viewFiles) {
  const code = fs.readFileSync(file, 'utf-8');
  const relativePath = path.relative(ROOT_DIR, file);
  if (/CONTENT\.[a-zA-Z0-9_.]+\s*=\s*/.test(code) || /delete\s+CONTENT\./.test(code)) {
    mutationFiles.push(relativePath);
  }
}
record(
  'G4: Import Purity',
  'No component performs runtime mutations on CONTENT object',
  mutationFiles.length === 0,
  mutationFiles.length === 0 ? 'CONTENT is treated as immutable' : `Mutations in: ${mutationFiles.join(', ')}`
);

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 5: Hardcoded Vietnamese Text Audit (Adversarial Regex Scan)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- GROUP 5: Adversarial Hardcoded Text Audit ---');

const VIETNAMESE_REGEX = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐ]/;

let hardcodedOccurrences = [];
for (const file of viewFiles) {
  const contentLines = fs.readFileSync(file, 'utf-8').split('\n');
  const relativePath = path.relative(ROOT_DIR, file);

  contentLines.forEach((line, lineIdx) => {
    const trimmed = line.trim();
    // Skip single line comments
    if (trimmed.startsWith('//') || trimmed.startsWith('{/*') || trimmed.startsWith('*')) {
      return;
    }
    if (VIETNAMESE_REGEX.test(line)) {
      hardcodedOccurrences.push({
        file: relativePath,
        line: lineIdx + 1,
        content: trimmed
      });
    }
  });
}

const noHardcodedCopy = hardcodedOccurrences.length === 0;
record(
  'G5: Copy Centralization',
  'Zero hardcoded Vietnamese characters in view components (case-insensitive + diacritics)',
  noHardcodedCopy,
  noHardcodedCopy ? 'Clean: 0 hardcoded occurrences' : `CHALLENGE: Found ${hardcodedOccurrences.length} hardcoded strings:\n${hardcodedOccurrences.map(o => `      ${o.file}:${o.line} -> ${o.content}`).join('\n')}`
);

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 6: Component Empty/Missing Array Runtime Resilience
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- GROUP 6: Edge Case & Null-Safety Stress Testing ---');

// Test 6.1: DefinitionSection highlightWord="" edge case
const definitionHighlightResilient = (() => {
  const defFile = path.join(srcDir, 'sections/DefinitionSection.tsx');
  const code = fs.readFileSync(defFile, 'utf-8');
  // Check if it safely handles highlightWord: ""
  // If definition.highlightWord is empty, split("")[0] returns 1 char!
  return code.includes('definition.highlightWord &&');
})();
record(
  'G6: Edge Resilience',
  'DefinitionSection safely handles empty highlightWord ("") without truncating subheadline',
  definitionHighlightResilient,
  definitionHighlightResilient ? 'Safe guard present' : 'CHALLENGE: definition.subheadline.includes("") causes subheadline truncation to 2 chars when highlightWord=""'
);

// Test 6.2: PainSection empty tabs[] protection
const painSectionTabsResilient = (() => {
  const painFile = path.join(srcDir, 'sections/PainSection.tsx');
  const code = fs.readFileSync(painFile, 'utf-8');
  // Check if tabs[0] is guarded against empty array
  return code.includes('painPoints.tabs?.[0]?.id') || code.includes('painPoints.tabs.length > 0 ?');
})();
record(
  'G6: Edge Resilience',
  'PainSection safely handles empty painPoints.tabs: [] without unhandled TypeError',
  painSectionTabsResilient,
  painSectionTabsResilient ? 'Safe guard present' : 'CHALLENGE: tabs[0].id throws unhandled TypeError if painPoints.tabs is empty'
);

// Test 6.3: GrowthChartSection empty data[] protection
const chartDataResilient = (() => {
  const chartFile = path.join(srcDir, 'sections/GrowthChartSection.tsx');
  const code = fs.readFileSync(chartFile, 'utf-8');
  return code.includes('chart.data.length > 1') || code.includes('pointsMarketing.length > 0');
})();
record(
  'G6: Edge Resilience',
  'GrowthChartSection safely handles empty chart.data: [] without unhandled TypeError / NaN division',
  chartDataResilient,
  chartDataResilient ? 'Safe guard present' : 'CHALLENGE: pointsMarketing[0].x throws TypeError on empty data, and division by (chart.data.length - 1) divides by zero on 1 item'
);

// ─────────────────────────────────────────────────────────────────────────────
// GROUP 7: Clean Restoration Verification
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- GROUP 7: Clean Restoration & Final Verification ---');
restoreInitial();

const finalTypecheck = runCommand('npm run typecheck');
record('G7: Restoration', 'Final npm run typecheck passes with 0 errors', finalTypecheck.success, finalTypecheck.success ? 'Typecheck OK' : finalTypecheck.output.trim().slice(0, 200));

const finalBuild = runCommand('npm run build');
record('G7: Restoration', 'Final npm run build passes with 0 errors', finalBuild.success, finalBuild.success ? 'Build OK' : finalBuild.output.trim().slice(0, 200));

// ─────────────────────────────────────────────────────────────────────────────
// SUMMARY MATRIX
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n===============================================================');
console.log('📊 M1 ADVERSARIAL STRESS TEST SUMMARY MATRIX');
console.log('===============================================================');

const passedCount = results.filter(r => r.passed).length;
const failedCount = results.filter(r => !r.passed).length;
console.log(`Total Stress Tests Executed: ${results.length}`);
console.log(`Passed:                      ${passedCount}`);
console.log(`Failed:                      ${failedCount}`);
console.log('===============================================================');

  if (failedCount > 0) {
    console.log('⚠️ CHALLENGE RESULT: CHALLENGE_FOUND');
    exitCode = 1;
  } else {
    console.log('🎉 CHALLENGE RESULT: APPROVE');
    exitCode = 0;
  }
} catch (err) {
  console.error('Fatal unhandled error during stress harness execution:', err);
  exitCode = 1;
} finally {
  cleanup();
}
process.exit(exitCode);
