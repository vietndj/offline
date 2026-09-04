import handler, { getSpreadsheetConfig } from '../../api/register.ts';

async function runDirectHandlerTests() {
  console.log('=======================================================');
  console.log('🧪 DIRECT UNIT TESTING ON /api/register.ts HANDLER');
  console.log('=======================================================\n');

  function createMockRes() {
    return {
      statusCode: 200,
      headers: {},
      body: null,
      setHeader(name, value) {
        this.headers[name] = value;
        return this;
      },
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.body = data;
        return this;
      },
      end() {
        return this;
      }
    };
  }

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.log(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  // Test 1: Config resolution
  const config = getSpreadsheetConfig();
  assert(
    config.primaryId === '1PaHkFMdY615FasQDcqqeia94L1662YKES7cPuFIpKhg',
    `Config Primary ID should be 1PaHkFMd... (got ${config.primaryId})`
  );
  assert(
    config.primaryName === 'Danh Sách Học Viên',
    `Config Primary Sheet Name should be 'Danh Sách Học Viên' (got ${config.primaryName})`
  );
  assert(
    config.masterId === '1J9ZrjLxTba9R-wuet1n_J_hKcL0PVtQDD_ag65Ewx04',
    `Config Master ID should be 1J9ZrjLx... (got ${config.masterId})`
  );
  assert(
    config.masterName === 'Offline FEDU',
    `Config Master Sheet Name should be 'Offline FEDU' (got ${config.masterName})`
  );

  // Test 2: GET health check
  const resGet = createMockRes();
  await handler({ method: 'GET' }, resGet);
  assert(resGet.statusCode === 200, 'GET /api/register returns HTTP 200');
  assert(resGet.body?.status === 'healthy', 'GET /api/register returns status healthy');
  assert(resGet.body?.primarySheet?.includes(config.primaryId), 'GET returns primarySheet URL');
  assert(resGet.body?.masterSheet?.includes(config.masterId), 'GET returns masterSheet URL');
  assert(resGet.body?.sheet?.includes(config.primaryId), 'GET returns backward-compatible sheet URL');

  // Test 3: OPTIONS CORS preflight
  const resOptions = createMockRes();
  await handler({ method: 'OPTIONS' }, resOptions);
  assert(resOptions.statusCode === 200, 'OPTIONS returns HTTP 200');
  assert(resOptions.headers['Access-Control-Allow-Origin'] === '*', 'OPTIONS has CORS Allow-Origin *');
  assert(resOptions.headers['Access-Control-Allow-Methods'].includes('POST'), 'OPTIONS has CORS Allow-Methods');

  // Test 4: POST with malformed JSON string body
  const resMalformed = createMockRes();
  await handler({ method: 'POST', body: '{invalid:json' }, resMalformed);
  assert(resMalformed.statusCode === 400, 'Malformed JSON body returns HTTP 400');
  assert(resMalformed.body?.success === false, 'Malformed JSON returns success: false');
  assert(resMalformed.body?.error.includes('JSON'), 'Malformed JSON returns clear error message');

  // Test 5: POST with missing required fields
  const resMissing = createMockRes();
  await handler({ method: 'POST', body: { fullName: '' } }, resMissing);
  assert(resMissing.statusCode === 400, 'Missing fields returns HTTP 400');
  assert(resMissing.body?.success === false, 'Missing fields returns success: false');
  assert(resMissing.body?.error.includes('Thiếu họ tên hoặc số điện thoại'), 'Missing fields error message correct');

  // Test 6: POST with invalid short phone
  const resShortPhone = createMockRes();
  await handler({ method: 'POST', body: { fullName: 'Test', phone: '123' } }, resShortPhone);
  assert(resShortPhone.statusCode === 400, 'Short phone returns HTTP 400');
  assert(resShortPhone.body?.error.includes('Số điện thoại không hợp lệ'), 'Short phone error message correct');

  // Test 7: Method Not Allowed
  const resDelete = createMockRes();
  await handler({ method: 'DELETE' }, resDelete);
  assert(resDelete.statusCode === 405, 'DELETE returns HTTP 405');
  assert(resDelete.body?.error === 'Method Not Allowed', 'DELETE returns Method Not Allowed');

  console.log(`\n=======================================================`);
  console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  console.log('=======================================================');

  if (failed > 0) process.exit(1);
}

runDirectHandlerTests().catch(err => {
  console.error(err);
  process.exit(1);
});
