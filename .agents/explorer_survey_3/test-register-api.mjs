import 'dotenv/config';
import { google } from 'googleapis';

const BASE_URL = process.env.TARGET_URL || 'https://offline.fedu.vn';

async function runRegisterTests() {
  console.log(`=======================================================`);
  console.log(`🧪 TESTING /api/register ENDPOINT: ${BASE_URL}/api/register`);
  console.log(`=======================================================\n`);

  // Test 1: GET Health Check
  try {
    const res = await fetch(`${BASE_URL}/api/register`);
    const data = await res.json();
    if (res.status === 200 && data.status === 'healthy') {
      console.log(`✅ [TEST 1] GET /api/register: PASS (HTTP 200 healthy)`);
      console.log(`   - Service: ${data.service}`);
      console.log(`   - Sheet URL: ${data.sheet}`);
    } else {
      console.log(`❌ [TEST 1] GET /api/register: FAIL (Status: ${res.status})`, data);
    }
  } catch (err) {
    console.log(`❌ [TEST 1] GET /api/register error: ${err.message}`);
  }

  // Test 2: OPTIONS CORS Preflight
  try {
    const res = await fetch(`${BASE_URL}/api/register`, { method: 'OPTIONS' });
    if (res.status === 200) {
      console.log(`✅ [TEST 2] OPTIONS /api/register: PASS (HTTP 200 CORS allowed)`);
    } else {
      console.log(`❌ [TEST 2] OPTIONS /api/register: FAIL (Status: ${res.status})`);
    }
  } catch (err) {
    console.log(`❌ [TEST 2] OPTIONS /api/register error: ${err.message}`);
  }

  // Test 3: POST Missing Required Fields (Expect 400 Bad Request)
  try {
    const res = await fetch(`${BASE_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: "Nguyễn Văn Test" }) // missing phone
    });
    const data = await res.json();
    if (res.status === 400 && data.success === false) {
      console.log(`✅ [TEST 3] POST missing phone: PASS (HTTP 400 validation error: "${data.error}")`);
    } else {
      console.log(`❌ [TEST 3] POST missing phone: FAIL (Status: ${res.status})`, data);
    }
  } catch (err) {
    console.log(`❌ [TEST 3] POST missing phone error: ${err.message}`);
  }

  // Test 4: POST Valid Payload Scenario
  const testPayload = {
    fullName: "[AUTOMATED TEST] Nguyen Van Test",
    phone: "0900000000",
    email: "test.automated@fedu.vn",
    occupation: "Học Viên Thử Nghiệm Hệ Thống",
    reason: "Kiểm thử tự động đồng bộ Google Sheets và Telegram",
    source: "automated-test-suite"
  };

  console.log(`\n📋 [TEST 4 PAYLOAD READY] Valid submission payload:`);
  console.log(JSON.stringify(testPayload, null, 2));

  if (process.env.EXECUTE_REAL_SUBMISSION === 'true') {
    try {
      console.log(`\n🚀 Executing real submission against ${BASE_URL}/api/register...`);
      const res = await fetch(`${BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload)
      });
      const data = await res.json();
      if (res.status === 200 && data.success === true) {
        console.log(`✅ [TEST 4] POST valid payload: PASS (HTTP 200 success)`);
        console.log(`   - Message: ${data.message}`);
        console.log(`   - Item submitted:`, data.item);
      } else {
        console.log(`❌ [TEST 4] POST valid payload: FAIL (Status: ${res.status})`, data);
      }
    } catch (err) {
      console.log(`❌ [TEST 4] POST valid payload error: ${err.message}`);
    }
  } else {
    console.log(`ℹ️ [TEST 4 NOTE] Real submission dry-run skipped to prevent Telegram spam.`);
    console.log(`   To execute live test submission, run with: EXECUTE_REAL_SUBMISSION=true node test-register-api.mjs`);
  }

  console.log(`\n=======================================================`);
}

runRegisterTests().catch(console.error);
