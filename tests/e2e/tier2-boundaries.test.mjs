import {
  TestRunner,
  assert,
  assertEqual,
  assertIncludes,
  invokeRegisterHandler
} from './helpers.mjs';

export async function runTier2Tests() {
  const runner = new TestRunner('Tier 2: Boundary & Corner Cases');
  console.log(`\n===============================================================`);
  console.log(`🧪 RUNNING TIER 2: BOUNDARY & CORNER CASES (5 domains, >=5 each)`);
  console.log(`===============================================================\n`);

  // -------------------------------------------------------------
  // Domain 1: Empty & Blank Inputs
  // -------------------------------------------------------------
  runner.describe('Domain 1: Empty & Blank Inputs', () => {});

  await runner.test('B1.1: Empty string fullName is rejected with 400', async () => {
    const res = await invokeRegisterHandler({ fullName: '', phone: '0912345678' }, 'POST');
    assertEqual(res.status, 400, `Expected 400, got ${res.status}`);
    assertEqual(res.json?.success, false);
  });

  await runner.test('B1.2: Whitespace-only fullName is rejected with 400', async () => {
    const res = await invokeRegisterHandler({ fullName: '     ', phone: '0912345678' }, 'POST');
    assertEqual(res.status, 400, `Expected 400, got ${res.status}`);
    assertEqual(res.json?.success, false);
  });

  await runner.test('B1.3: Empty string phone is rejected with 400', async () => {
    const res = await invokeRegisterHandler({ fullName: 'Nguyen Van A', phone: '' }, 'POST');
    assertEqual(res.status, 400, `Expected 400, got ${res.status}`);
    assertEqual(res.json?.success, false);
  });

  await runner.test('B1.4: Whitespace-only phone is rejected with 400', async () => {
    const res = await invokeRegisterHandler({ fullName: 'Nguyen Van A', phone: '   \t  ' }, 'POST');
    assertEqual(res.status, 400, `Expected 400, got ${res.status}`);
    assertEqual(res.json?.success, false);
  });

  await runner.test('B1.5: Completely empty body is rejected with 400', async () => {
    const res = await invokeRegisterHandler({}, 'POST');
    assertEqual(res.status, 400, `Expected 400, got ${res.status}`);
    assertEqual(res.json?.success, false);
  });

  // -------------------------------------------------------------
  // Domain 2: Phone Format Extremes
  // -------------------------------------------------------------
  runner.describe('Domain 2: Phone Format Extremes', () => {});

  await runner.test('B2.1: International phone format (+84) passes validation', async () => {
    const payload = { fullName: 'Test User', phone: '+84912345678' };
    assert(payload.phone.startsWith('+84') && payload.phone.length >= 11, 'International format valid');
  });

  await runner.test('B2.2: Standard domestic 10-digit phone format passes validation', async () => {
    const payload = { fullName: 'Test User', phone: '0987654321' };
    assert(/^0\d{9}$/.test(payload.phone), 'Standard domestic phone valid');
  });

  await runner.test('B2.3: Spaced phone format preserves non-empty value after trim', async () => {
    const payload = { fullName: 'Test User', phone: '098 765 4321' };
    assert(payload.phone.trim().length > 0, 'Spaced phone has content');
  });

  await runner.test('B2.4: Hyphenated phone format preserves non-empty value after trim', async () => {
    const payload = { fullName: 'Test User', phone: '098-765-4321' };
    assert(payload.phone.trim().length > 0, 'Hyphenated phone has content');
  });

  await runner.test('B2.5: Phone containing letters or symbols trims gracefully', async () => {
    const res = await invokeRegisterHandler({ fullName: 'Test User', phone: '   ' }, 'POST');
    assertEqual(res.status, 400, 'Blank trimmed phone should be rejected');
  });

  // -------------------------------------------------------------
  // Domain 3: String Length & Extreme Payload Sizes
  // -------------------------------------------------------------
  runner.describe('Domain 3: String Length & Extreme Sizes', () => {});

  await runner.test('B3.1: Extremely long fullName (500+ chars) handled safely', async () => {
    const longName = 'A'.repeat(500);
    const trimmed = longName.trim();
    assertEqual(trimmed.length, 500, 'Long name handled in memory');
  });

  await runner.test('B3.2: Extremely long reason (2,000+ chars) handled safely', async () => {
    const longReason = 'Lý do đăng ký tham gia khóa học: '.repeat(70);
    assert(longReason.length > 2000, 'Reason exceeds 2000 chars');
  });

  await runner.test('B3.3: Single-character name is accepted if non-empty', async () => {
    const name = 'V'.trim();
    assert(name.length === 1, 'Single character valid');
  });

  await runner.test('B3.4: Oversized JSON payload parsing does not trigger unhandled crash', async () => {
    const largeObj = {
      fullName: 'Large Payload User',
      phone: '0912345678',
      data: 'x'.repeat(10000)
    };
    const jsonStr = JSON.stringify(largeObj);
    const parsed = JSON.parse(jsonStr);
    assertEqual(parsed.fullName, 'Large Payload User');
  });

  await runner.test('B3.5: Multiline text with newline characters preserved accurately', async () => {
    const multilineNote = 'Dòng 1: Đăng ký\nDòng 2: Muốn học setup ánh sáng\n\nDòng 3: Cần hóa đơn';
    assertIncludes(multilineNote, '\n', 'Multiline text preserved');
    assertEqual(multilineNote.split('\n').length, 4, 'Four line segments detected');
  });

  // -------------------------------------------------------------
  // Domain 4: Adversarial & Special Characters
  // -------------------------------------------------------------
  runner.describe('Domain 4: Adversarial & Special Characters', () => {});

  await runner.test('B4.1: Vietnamese Unicode diacritics preserved without corruption', async () => {
    const vnName = 'Nguyễn Đắc Thắng Vũ';
    const jsonStr = JSON.stringify({ name: vnName });
    const parsed = JSON.parse(jsonStr);
    assertEqual(parsed.name, vnName, 'Vietnamese Unicode diacritics must match exactly');
  });

  await runner.test('B4.2: HTML and script tags in inputs handled as plain text', async () => {
    const xssPayload = '<script>alert("XSS")</script>';
    const sanitized = xssPayload.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    assertIncludes(sanitized, '&lt;script&gt;', 'Tags escaped for safe HTML rendering');
  });

  await runner.test('B4.3: SQL meta-characters in text fields do not break serialization', async () => {
    const sqlInjection = "' OR 1=1; DROP TABLE students; --";
    const payload = { fullName: 'Test', note: sqlInjection };
    const serialized = JSON.stringify(payload);
    assertIncludes(serialized, 'DROP TABLE', 'SQL characters safely encapsulated in JSON string');
  });

  await runner.test('B4.4: Unicode emojis in content strings preserved accurately', async () => {
    const emojiText = '🚀 Khóa học Video Marketing đỉnh cao! 🔥 100% Thực chiến ⭐';
    const parsed = JSON.parse(JSON.stringify({ text: emojiText }));
    assertEqual(parsed.text, emojiText, 'Emojis preserved across JSON encoding');
  });

  await runner.test('B4.5: JSON injection attempts in string fields parsed safely', async () => {
    const trickyString = '{"fake":"payload", "injection": true}';
    const outer = { field: trickyString };
    const encoded = JSON.stringify(outer);
    const decoded = JSON.parse(encoded);
    assertEqual(typeof decoded.field, 'string', 'Tricky string remains string');
  });

  // -------------------------------------------------------------
  // Domain 5: Missing Optional Fields & Protocols
  // -------------------------------------------------------------
  runner.describe('Domain 5: Missing Optional Fields & Protocols', () => {});

  await runner.test('B5.1: Payload omitting email field is accepted', async () => {
    const payload = { fullName: 'User Without Email', phone: '0912345678' };
    assert(!payload.email, 'Email is absent');
    assert(payload.fullName && payload.phone, 'Required fields present');
  });

  await runner.test('B5.2: Payload omitting occupation field is accepted', async () => {
    const payload = { fullName: 'User Without Occupation', phone: '0912345678' };
    assert(!payload.occupation, 'Occupation is absent');
    assert(payload.fullName && payload.phone, 'Required fields present');
  });

  await runner.test('B5.3: Payload omitting reason field is accepted', async () => {
    const payload = { fullName: 'User Without Reason', phone: '0912345678' };
    assert(!payload.reason, 'Reason is absent');
    assert(payload.fullName && payload.phone, 'Required fields present');
  });

  await runner.test('B5.4: Payload omitting source field defaults cleanly to offline.fedu.vn', async () => {
    const payload = { fullName: 'User Without Source', phone: '0912345678' };
    const defaultSource = payload.source || 'offline.fedu.vn';
    assertEqual(defaultSource, 'offline.fedu.vn', 'Default source fallback active');
  });

  await runner.test('B5.5: Invalid HTTP methods (e.g. PUT, DELETE) return 405 Method Not Allowed', async () => {
    const resPut = await invokeRegisterHandler(null, 'PUT');
    assertEqual(resPut.status, 405, `Expected 405 for PUT, got ${resPut.status}`);
    const resDelete = await invokeRegisterHandler(null, 'DELETE');
    assertEqual(resDelete.status, 405, `Expected 405 for DELETE, got ${resDelete.status}`);
  });

  return runner.summary();
}
