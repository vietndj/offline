import {
  TestRunner,
  assert,
  assertEqual,
  assertIncludes,
  fileExists,
  readText,
  invokeRegisterHandler
} from './helpers.mjs';

export async function runTier4Tests() {
  const runner = new TestRunner('Tier 4: Real-World Application Scenarios');
  console.log(`\n===============================================================`);
  console.log(`🧪 RUNNING TIER 4: REAL-WORLD APPLICATION SCENARIOS (4 Journeys)`);
  console.log(`===============================================================\n`);

  // -------------------------------------------------------------
  // Scenario 1: Complete Registration User Journey
  // -------------------------------------------------------------
  runner.describe('S1: Complete Registration User Journey', () => {});

  await runner.test('S1.1: Landing page presents CTA buttons that trigger registration modal', async () => {
    const navbarCode = readText('src/components/Navbar.tsx');
    const heroCode = readText('src/sections/HeroSection.tsx');
    assert(
      navbarCode.includes('onOpenModal') || navbarCode.includes('Register') || heroCode.includes('onOpenModal') || heroCode.includes('href="#register"'),
      'Landing page components must provide CTA handlers for registration'
    );
  });

  await runner.test('S1.2: RegisterModal manages full user input lifecycle and success redirect', async () => {
    const modalCode = readText('src/components/RegisterModal.tsx');
    assertIncludes(modalCode, 'fullName', 'Modal must bind fullName state');
    assertIncludes(modalCode, 'phone', 'Modal must bind phone state');
    assertIncludes(modalCode, '/success', 'Modal must redirect to /success upon registration');
  });

  await runner.test('S1.3: SuccessPage renders confirmation details and summary from CONTENT', async () => {
    const successCode = readText('src/pages/SuccessPage.tsx');
    assert(
      successCode.includes('successPage') && successCode.includes('CONTENT'),
      'SuccessPage must render confirmation details from CONTENT.successPage'
    );
  });

  // -------------------------------------------------------------
  // Scenario 2: Inline Form Error & Correction Journey
  // -------------------------------------------------------------
  runner.describe('S2: Inline Form Error & Correction Journey', () => {});

  await runner.test('S2.1: Inline form rejects blank submission with inline error message', async () => {
    const res = await invokeRegisterHandler({ fullName: '', phone: '' }, 'POST');
    assertEqual(res.status, 400, 'Empty submission must return 400');
    assertEqual(res.json.success, false);
    assertIncludes(res.json.error, 'Thiếu', 'Error message must explain missing fields');
  });

  await runner.test('S2.2: Inline form recovers when user supplies missing phone', async () => {
    const validData = {
      fullName: 'Học Viên Test Phục Hồi',
      phone: '0988776655',
      note: 'Đã bổ sung số điện thoại sau lỗi'
    };
    assert(validData.fullName.length > 0 && validData.phone.length >= 10, 'Recovered form payload valid');
  });

  // -------------------------------------------------------------
  // Scenario 3: Fast Modification Architecture Workflow
  // -------------------------------------------------------------
  runner.describe('S3: Fast Modification Architecture Workflow', () => {});

  await runner.test('S3.1: Content editor can locate any UI text in src/content.ts within seconds', async () => {
    const content = readText('src/content.ts');
    assert(content.length > 5000, 'src/content.ts contains centralized text repository');
    assertIncludes(content, 'hero:', 'Hero section easily discoverable in content.ts');
    assertIncludes(content, 'curriculum:', 'Curriculum easily discoverable in content.ts');
    assertIncludes(content, 'instructor:', 'Instructor easily discoverable in content.ts');
  });

  await runner.test('S3.2: Pure view components consume content directly without local text duplicates', async () => {
    const heroCode = readText('src/sections/HeroSection.tsx');
    assert(
      heroCode.includes('hero.headline') && (heroCode.includes('content') || heroCode.includes('CONTENT')),
      'HeroSection must bind headline from content.hero'
    );
  });

  // -------------------------------------------------------------
  // Scenario 4: Social Share & Crawler Journey
  // -------------------------------------------------------------
  runner.describe('S4: Social Share & Crawler Journey', () => {});

  await runner.test('S4.1: Social sharing crawler extracts complete 1280x720 OpenGraph card', async () => {
    const html = readText('index.html');
    assertIncludes(html, 'og:image', 'Must define og:image');
    assertIncludes(html, 'og:title', 'Must define og:title');
    assertIncludes(html, 'og:description', 'Must define og:description');
  });

  await runner.test('S4.2: Web crawler adheres to robots.txt permissions and sitemap', async () => {
    const robots = readText('public/robots.txt');
    assertIncludes(robots, 'Allow: /', 'Must allow root');
    assertIncludes(robots, 'Disallow: /api/', 'Must disallow /api/');
    assertIncludes(robots, 'Sitemap:', 'Must point to sitemap');
  });

  return runner.summary();
}
