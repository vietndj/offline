const BASE_URL = process.env.TARGET_URL || 'http://localhost:4001';

async function runErrorHandlingTests() {
  console.log('=======================================================');
  console.log(`🧪 TESTING ERROR HANDLING ON: ${BASE_URL}/api/register`);
  console.log('=======================================================\n');

  let passed = 0;
  let failed = 0;

  async function testCase(name, options, expectedStatus, expectedErrorSubstring) {
    try {
      const res = await fetch(`${BASE_URL}/api/register`, options);
      const data = await res.json();
      const statusMatch = res.status === expectedStatus;
      const errorMatch = data.success === false && (expectedErrorSubstring ? data.error.includes(expectedErrorSubstring) : true);

      if (statusMatch && errorMatch) {
        console.log(`✅ [PASS] ${name} -> HTTP ${res.status}: "${data.error}"`);
        passed++;
      } else {
        console.log(`❌ [FAIL] ${name} -> Expected HTTP ${expectedStatus} with "${expectedErrorSubstring}", got HTTP ${res.status}:`, data);
        failed++;
      }
    } catch (err) {
      console.log(`❌ [FAIL] ${name} -> Exception: ${err.message}`);
      failed++;
    }
  }

  // 1. Missing phone
  await testCase('Missing phone', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName: 'Nguyen Van Test' })
  }, 400, 'Thiếu họ tên hoặc số điện thoại');

  // 2. Missing fullName
  await testCase('Missing fullName', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: '0901234567' })
  }, 400, 'Thiếu họ tên hoặc số điện thoại');

  // 3. Both empty strings
  await testCase('Both empty strings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName: '   ', phone: '   ' })
  }, 400, 'Thiếu họ tên hoặc số điện thoại');

  // 4. Empty payload object
  await testCase('Empty JSON object {}', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  }, 400, 'Thiếu họ tên hoặc số điện thoại');

  // 5. Invalid short phone (< 9 digits)
  await testCase('Short phone (3 digits)', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName: 'Nguyen Van Test', phone: '123' })
  }, 400, 'Số điện thoại không hợp lệ');

  // 6. Invalid long phone (> 15 digits)
  await testCase('Long phone (> 15 digits)', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName: 'Nguyen Van Test', phone: '0123456789012345678' })
  }, 400, 'Số điện thoại không hợp lệ');

  // 7. Non-numeric phone with insufficient digits
  await testCase('Phone with no digits: "abc"', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName: 'Nguyen Van Test', phone: 'abc-xyz' })
  }, 400, 'Số điện thoại không hợp lệ');

  // 8. Method Not Allowed (DELETE)
  try {
    const res = await fetch(`${BASE_URL}/api/register`, { method: 'DELETE' });
    const data = await res.json();
    if (res.status === 405 && data.error === 'Method Not Allowed') {
      console.log(`✅ [PASS] Method Not Allowed (DELETE) -> HTTP 405: "${data.error}"`);
      passed++;
    } else {
      console.log(`❌ [FAIL] Method Not Allowed (DELETE) -> Expected HTTP 405, got HTTP ${res.status}:`, data);
      failed++;
    }
  } catch (err) {
    console.log(`❌ [FAIL] Method Not Allowed (DELETE) -> Exception: ${err.message}`);
    failed++;
  }

  // 9. Method Not Allowed (PUT)
  try {
    const res = await fetch(`${BASE_URL}/api/register`, { method: 'PUT' });
    const data = await res.json();
    if (res.status === 405 && data.error === 'Method Not Allowed') {
      console.log(`✅ [PASS] Method Not Allowed (PUT) -> HTTP 405: "${data.error}"`);
      passed++;
    } else {
      console.log(`❌ [FAIL] Method Not Allowed (PUT) -> Expected HTTP 405, got HTTP ${res.status}:`, data);
      failed++;
    }
  } catch (err) {
    console.log(`❌ [FAIL] Method Not Allowed (PUT) -> Exception: ${err.message}`);
    failed++;
  }

  console.log(`\n=======================================================`);
  console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  console.log('=======================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runErrorHandlingTests().catch(console.error);
