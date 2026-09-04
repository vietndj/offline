import { CONTENT } from '../../src/content.ts';

async function verifyLiveContent() {
  console.log('=======================================================');
  console.log('🌐 VERIFYING LIVE CONTENT RENDERED ON https://offline.fedu.vn');
  console.log('=======================================================\n');

  const htmlRes = await fetch('https://offline.fedu.vn');
  if (htmlRes.status !== 200) {
    throw new Error(`Failed to fetch live homepage: HTTP ${htmlRes.status}`);
  }
  const html = await htmlRes.text();

  const jsMatch = html.match(/\/assets\/index-[^\"']+\.js/);
  if (!jsMatch) {
    throw new Error('Could not locate main JS bundle in live HTML');
  }
  const jsUrl = 'https://offline.fedu.vn' + jsMatch[0];
  console.log(`Live JS Bundle: ${jsUrl}\n`);
  const jsRes = await fetch(jsUrl);
  if (jsRes.status !== 200) {
    throw new Error(`Failed to fetch live JS bundle: HTTP ${jsRes.status}`);
  }
  const jsText = await jsRes.text();

  const testCases = [
    { section: 'Site', field: 'brandName', expected: CONTENT.site.brandName },
    { section: 'Site', field: 'hotline', expected: CONTENT.site.hotline },
    { section: 'Navbar', field: 'brand.title', expected: CONTENT.navbar.brand.title },
    { section: 'Navbar', field: 'cta', expected: CONTENT.navbar.cta },
    { section: 'Hero', field: 'headline', expected: CONTENT.hero.headline },
    { section: 'Hero', field: 'subheadline', expected: CONTENT.hero.subheadline },
    { section: 'Hero', field: 'cta', expected: CONTENT.hero.cta },
    { section: 'Proof', field: 'headline', expected: CONTENT.proof.headline },
    { section: 'Proof', field: 'description', expected: CONTENT.proof.description },
    { section: 'Proof', field: 'reportCard.badge', expected: CONTENT.proof.reportCard.badge },
    { section: 'Definition', field: 'headline', expected: CONTENT.definition.headline },
    { section: 'GrowthChart', field: 'headline', expected: CONTENT.chart.headline },
    { section: 'Metaphors', field: 'headline', expected: CONTENT.metaphors.headline },
    { section: 'PainPoints', field: 'headline', expected: CONTENT.painPoints.headline },
    { section: 'Curriculum', field: 'headline', expected: CONTENT.curriculum.headline },
    { section: 'Curriculum', field: 'days[0].title', expected: CONTENT.curriculum.days[0].title },
    { section: 'Curriculum', field: 'days[1].title', expected: CONTENT.curriculum.days[1].title },
    { section: 'BannerCta', field: 'title', expected: CONTENT.bannerCta.title },
    { section: 'Showcase', field: 'headline', expected: CONTENT.showcase.headline },
    { section: 'TargetAudience', field: 'headline', expected: CONTENT.targetAudience.headline },
    { section: 'TargetAudience', field: 'fit[0].title', expected: CONTENT.targetAudience.fit[0].title },
    { section: 'Instructor', field: 'name', expected: CONTENT.instructor.name },
    { section: 'Instructor', field: 'mainRole', expected: CONTENT.instructor.mainRole },
    { section: 'Instructor', field: 'subRole', expected: CONTENT.instructor.subRole },
    { section: 'Instructor', field: 'quote', expected: CONTENT.instructor.quote },
    { section: 'Register', field: 'headlinePrefix', expected: CONTENT.register.headlinePrefix },
    { section: 'FaqSection', field: 'headline', expected: CONTENT.faqSection.headline },
    { section: 'Faqs', field: 'faqs[0].q', expected: CONTENT.faqs[0].q },
    { section: 'StickyCTA', field: 'cta', expected: CONTENT.stickyBottomCta.cta },
    { section: 'Footer', field: 'copyright', expected: CONTENT.footer.copyright }
  ];

  let passed = 0;
  let failed = 0;

  for (const t of testCases) {
    if (!t.expected) {
      console.log(`❌ FAIL: [${t.section.padEnd(14)}] ${t.field.padEnd(16)} -> EXPECTED VALUE UNDEFINED`);
      failed++;
      continue;
    }
    const found = jsText.includes(t.expected) || html.includes(t.expected);
    if (found) {
      console.log(`✅ PASS: [${t.section.padEnd(14)}] ${t.field.padEnd(16)} -> "${t.expected.slice(0, 48)}..."`);
      passed++;
    } else {
      console.log(`❌ FAIL: [${t.section.padEnd(14)}] ${t.field.padEnd(16)} -> "${t.expected}"`);
      failed++;
    }
  }

  console.log('\n=======================================================');
  console.log(`📊 LIVE CONTENT VERIFICATION SUMMARY:`);
  console.log(`- Total Checks: ${testCases.length}`);
  console.log(`- Passed: ${passed}`);
  console.log(`- Failed: ${failed}`);
  console.log(`- Status: ${failed === 0 ? 'ALL CHECKS PASSED ✅' : 'FAILURES DETECTED ❌'}`);
  console.log('=======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

verifyLiveContent().catch(err => {
  console.error('Fatal live content verification error:', err);
  process.exit(1);
});
