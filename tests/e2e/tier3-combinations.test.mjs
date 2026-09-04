import {
  TestRunner,
  assert,
  assertEqual,
  assertIncludes,
  assertLessThan,
  fileExists,
  readText,
  getFileSize,
  getGzipSize,
  findFilesRecursively,
  invokeRegisterHandler
} from './helpers.mjs';
import path from 'node:path';

export async function runTier3Tests() {
  const runner = new TestRunner('Tier 3: Cross-Feature Combinations');
  console.log(`\n===============================================================`);
  console.log(`🧪 RUNNING TIER 3: CROSS-FEATURE COMBINATIONS (Pairwise)`);
  console.log(`===============================================================\n`);

  // -------------------------------------------------------------
  // C1 (F1 + F6): Centralized Content + Bundle Optimization
  // -------------------------------------------------------------
  runner.describe('C1: F1 (Content) + F6 (Bundle Budget)', () => {});

  await runner.test('C1.1: src/content.ts with full 14 sections maintains gzip bundle < 120KB', async () => {
    const jsFiles = findFilesRecursively('dist/assets', (name) => name.startsWith('index-') && name.endsWith('.js'));
    assert(jsFiles.length > 0, 'Production bundle must exist');
    const gzipSize = getGzipSize(jsFiles[0]);
    const kb = gzipSize / 1024;
    assertLessThan(kb, 120, `Gzip bundle size ${kb.toFixed(2)}KB must be strictly < 120KB`);
  });

  // -------------------------------------------------------------
  // C2 (F1 + F3): Centralized Content + Content Map
  // -------------------------------------------------------------
  runner.describe('C2: F1 (Content) + F3 (Content Map)', () => {});

  await runner.test('C2.1: Key section names in src/content.ts are documented in CONTENT_MAP.md', async () => {
    if (!fileExists('CONTENT_MAP.md')) {
      console.log('     (CONTENT_MAP.md pending from worker M1)');
      return;
    }
    const mapText = readText('CONTENT_MAP.md');
    const contentText = readText('src/content.ts');
    const coreKeys = ['hero', 'curriculum', 'proof', 'faq', 'footer'];
    for (const key of coreKeys) {
      if (contentText.includes(`${key}:`)) {
        assert(mapText.toLowerCase().includes(key), `CONTENT_MAP.md should document section ${key}`);
      }
    }
  });

  // -------------------------------------------------------------
  // C3 (F7 + F12): SEO Metadata + Production Rendering
  // -------------------------------------------------------------
  runner.describe('C3: F7 (SEO Tags) + F12 (Production Verification)', () => {});

  await runner.test('C3.1: Canonical URL in index.html matches production domain https://offline.fedu.vn/', async () => {
    const html = readText('index.html');
    const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
    assert(canonicalMatch, 'Canonical tag must exist');
    assertEqual(canonicalMatch[1], 'https://offline.fedu.vn/', 'Canonical must be https://offline.fedu.vn/');
  });

  await runner.test('C3.2: OpenGraph banner is served from public/opengraph.jpg', async () => {
    const html = readText('index.html');
    assertIncludes(html, 'opengraph.jpg', 'OpenGraph image must reference opengraph.jpg');
    assert(fileExists('public/opengraph.jpg'), 'public/opengraph.jpg must physically exist');
  });

  // -------------------------------------------------------------
  // C4 (F9 + F10): API Contract + Form Error Handling
  // -------------------------------------------------------------
  runner.describe('C4: F9 (API Register) + F10 (Form Error Handling)', () => {});

  await runner.test('C4.1: API 400 error schema matches frontend error response parser', async () => {
    const res = await invokeRegisterHandler({ fullName: 'Test' }, 'POST');
    assertEqual(res.status, 400);
    assert(typeof res.json === 'object', 'Response must be JSON');
    assertEqual(res.json.success, false, 'Expected success: false');
    assert(typeof res.json.error === 'string', 'Expected error to be a string message');

    // Check frontend consumer logic
    const modalCode = readText('src/components/RegisterModal.tsx');
    assertIncludes(modalCode, 'data.error', 'RegisterModal must consume data.error');
  });

  // -------------------------------------------------------------
  // C5 (F5 + F6): Asset Pruning + Build Distribution
  // -------------------------------------------------------------
  runner.describe('C5: F5 (Asset Pruning) + F6 (Build Output)', () => {});

  await runner.test('C5.1: Dist JS and CSS code bundles remain lightweight and optimized', async () => {
    const codeFiles = findFilesRecursively('dist/assets', (name) => name.endsWith('.js') || name.endsWith('.css'));
    for (const file of codeFiles) {
      const sizeMb = getFileSize(file) / (1024 * 1024);
      assertLessThan(sizeMb, 1, `Code bundle asset ${file} must be < 1MB (found ${sizeMb.toFixed(2)}MB)`);
    }
  });

  // -------------------------------------------------------------
  // C6 (F8 + F11): Robots/Favicon + Production Hosting
  // -------------------------------------------------------------
  runner.describe('C6: F8 (Robots/Favicon) + F11 (Production Config)', () => {});

  await runner.test('C6.1: Favicon SVG and Robots TXT are in public/ for Vercel static serving', async () => {
    assert(fileExists('public/favicon.svg'), 'public/favicon.svg must exist');
    assert(fileExists('public/robots.txt'), 'public/robots.txt must exist');
    const robots = readText('public/robots.txt');
    assertIncludes(robots, 'Disallow: /api/', 'Robots must disallow /api/');
  });

  return runner.summary();
}
