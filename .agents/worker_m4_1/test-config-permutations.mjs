import { getSpreadsheetConfig } from '../../api/register.ts';

function testPermutations() {
  console.log('=======================================================');
  console.log('🧪 TESTING CONFIG PERMUTATIONS & RESILIENCE');
  console.log('=======================================================\n');

  const origEnv = { ...process.env };
  let passed = 0;
  let failed = 0;

  function assert(condition, name) {
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.log(`❌ [FAIL] ${name}`);
      failed++;
    }
  }

  // Case 1: Vercel Production Misconfiguration (GOOGLE_SPREADSHEET_ID = Master ID)
  delete process.env.PRIMARY_SPREADSHEET_ID;
  delete process.env.MASTER_SPREADSHEET_ID;
  delete process.env.GOOGLE_MASTER_SPREADSHEET_ID;
  process.env.GOOGLE_SPREADSHEET_ID = '1J9ZrjLxTba9R-wuet1n_J_hKcL0PVtQDD_ag65Ewx04';
  let c1 = getSpreadsheetConfig();
  assert(
    c1.primaryId === '1PaHkFMdY615FasQDcqqeia94L1662YKES7cPuFIpKhg',
    'Case 1: Primary ID correctly falls back to Sổ Con when GOOGLE_SPREADSHEET_ID points to Master'
  );
  assert(
    c1.masterId === '1J9ZrjLxTba9R-wuet1n_J_hKcL0PVtQDD_ag65Ewx04',
    'Case 1: Master ID resolves to Master sheet'
  );
  assert(
    c1.primaryId !== c1.masterId,
    'Case 1: Primary and Master IDs are distinct (dual sync works!)'
  );

  // Case 2: Standard Clean Configuration (Explicit PRIMARY and MASTER env vars)
  process.env.PRIMARY_SPREADSHEET_ID = 'custom_primary_id_123';
  process.env.MASTER_SPREADSHEET_ID = 'custom_master_id_456';
  let c2 = getSpreadsheetConfig();
  assert(
    c2.primaryId === 'custom_primary_id_123',
    'Case 2: Primary ID respects PRIMARY_SPREADSHEET_ID'
  );
  assert(
    c2.masterId === 'custom_master_id_456',
    'Case 2: Master ID respects MASTER_SPREADSHEET_ID'
  );

  // Case 3: Standard Google Spreadsheet ID pointing to Sổ Con
  delete process.env.PRIMARY_SPREADSHEET_ID;
  delete process.env.MASTER_SPREADSHEET_ID;
  process.env.GOOGLE_SPREADSHEET_ID = '1PaHkFMdY615FasQDcqqeia94L1662YKES7cPuFIpKhg';
  let c3 = getSpreadsheetConfig();
  assert(
    c3.primaryId === '1PaHkFMdY615FasQDcqqeia94L1662YKES7cPuFIpKhg',
    'Case 3: Primary ID uses GOOGLE_SPREADSHEET_ID when pointing to Child sheet'
  );
  assert(
    c3.masterId === '1J9ZrjLxTba9R-wuet1n_J_hKcL0PVtQDD_ag65Ewx04',
    'Case 3: Master ID uses default master sheet'
  );

  // Case 4: No env vars at all (Clean Defaults)
  delete process.env.PRIMARY_SPREADSHEET_ID;
  delete process.env.MASTER_SPREADSHEET_ID;
  delete process.env.GOOGLE_SPREADSHEET_ID;
  delete process.env.GOOGLE_MASTER_SPREADSHEET_ID;
  let c4 = getSpreadsheetConfig();
  assert(
    c4.primaryId === '1PaHkFMdY615FasQDcqqeia94L1662YKES7cPuFIpKhg',
    'Case 4: Primary ID defaults to Sổ Con'
  );
  assert(
    c4.masterId === '1J9ZrjLxTba9R-wuet1n_J_hKcL0PVtQDD_ag65Ewx04',
    'Case 4: Master ID defaults to Sổ Mẹ'
  );

  // Restore env
  process.env = origEnv;

  console.log(`\n=======================================================`);
  console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  console.log('=======================================================');

  if (failed > 0) process.exit(1);
}

testPermutations();
