import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { execSync, spawn } from 'node:child_process';
import tls from 'node:tls';
import dns from 'node:dns/promises';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const ROOT_DIR = path.resolve(__dirname, '../..');

// Colors for terminal logging
export const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

/**
 * Lightweight Test Harness for E2E Suite
 */
export class TestRunner {
  constructor(name = 'Test Suite') {
    this.name = name;
    this.currentSuite = '';
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.skipped = 0;
    this.results = [];
    this.startTime = Date.now();
  }

  describe(suiteName, fn) {
    this.currentSuite = suiteName;
    return fn();
  }

  async test(testName, fn, options = {}) {
    const fullName = this.currentSuite ? `[${this.currentSuite}] ${testName}` : testName;
    const testStart = Date.now();

    if (options.skip) {
      this.skipped++;
      this.results.push({ name: fullName, status: 'SKIPPED', duration: 0, reason: options.skipReason });
      console.log(`  ${colors.yellow}↷ SKIP${colors.reset} ${fullName} ${options.skipReason ? `(${options.skipReason})` : ''}`);
      return;
    }

    try {
      await fn();
      const duration = Date.now() - testStart;
      this.passed++;
      this.results.push({ name: fullName, status: 'PASSED', duration });
      console.log(`  ${colors.green}✔ PASS${colors.reset} ${fullName} ${colors.gray}(${duration}ms)${colors.reset}`);
    } catch (err) {
      const duration = Date.now() - testStart;
      this.failed++;
      this.results.push({ name: fullName, status: 'FAILED', duration, error: err.message, stack: err.stack });
      console.log(`  ${colors.red}✖ FAIL${colors.reset} ${fullName} ${colors.gray}(${duration}ms)${colors.reset}`);
      console.log(`     ${colors.red}Error: ${err.message}${colors.reset}`);
    }
  }

  summary() {
    const totalDuration = Date.now() - this.startTime;
    return {
      name: this.name,
      total: this.passed + this.failed + this.skipped,
      passed: this.passed,
      failed: this.failed,
      skipped: this.skipped,
      duration: totalDuration,
      results: this.results
    };
  }
}

// Assertions
export function assert(condition, message = 'Assertion failed') {
  if (!condition) {
    throw new Error(message);
  }
}

export function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

export function assertIncludes(haystack, needle, message) {
  if (!haystack || !haystack.includes(needle)) {
    throw new Error(message || `Expected text to include "${needle}"`);
  }
}

export function assertMatches(actual, regex, message) {
  if (!regex.test(actual)) {
    throw new Error(message || `Expected "${actual}" to match ${regex}`);
  }
}

export function assertGreaterThan(actual, threshold, message) {
  if (!(actual > threshold)) {
    throw new Error(message || `Expected ${actual} to be greater than ${threshold}`);
  }
}

export function assertLessThan(actual, threshold, message) {
  if (!(actual < threshold)) {
    throw new Error(message || `Expected ${actual} to be less than ${threshold}`);
  }
}

// File and Directory Utilities
export function getFullPath(relPath) {
  return path.resolve(ROOT_DIR, relPath);
}

export function fileExists(relPath) {
  return fs.existsSync(getFullPath(relPath));
}

export function readText(relPath) {
  const full = getFullPath(relPath);
  if (!fs.existsSync(full)) return null;
  return fs.readFileSync(full, 'utf8');
}

export function getFileSize(relPath) {
  const full = getFullPath(relPath);
  if (!fs.existsSync(full)) return 0;
  return fs.statSync(full).size;
}

export function getGzipSize(relPath) {
  const full = getFullPath(relPath);
  if (!fs.existsSync(full)) return 0;
  const content = fs.readFileSync(full);
  return zlib.gzipSync(content).length;
}

export function listDirFiles(relPath) {
  const full = getFullPath(relPath);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full);
}

export function findFilesRecursively(dir, filterFn) {
  const fullDir = path.resolve(ROOT_DIR, dir);
  if (!fs.existsSync(fullDir)) return [];
  const results = [];

  function traverse(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        traverse(full);
      } else if (!filterFn || filterFn(entry.name, full)) {
        results.push(path.relative(ROOT_DIR, full));
      }
    }
  }

  traverse(fullDir);
  return results;
}

// Shell Command Execution
export function runCommand(cmd, options = {}) {
  try {
    const stdout = execSync(cmd, {
      cwd: ROOT_DIR,
      encoding: 'utf8',
      stdio: options.stdio || ['pipe', 'pipe', 'pipe'],
      timeout: options.timeout || 30000
    });
    return { exitCode: 0, stdout: stdout.trim(), stderr: '' };
  } catch (error) {
    return {
      exitCode: error.status || 1,
      stdout: (error.stdout || '').toString().trim(),
      stderr: (error.stderr || '').toString().trim()
    };
  }
}

// HTTP / Network Utilities
export async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    const text = await response.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      // not JSON
    }
    return {
      status: response.status,
      headers: response.headers,
      body: text,
      json
    };
  } finally {
    clearTimeout(id);
  }
}

export async function checkDns(domain) {
  try {
    const addresses = await dns.resolve4(domain);
    return { success: addresses.length > 0, addresses };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function checkTlsCert(domain) {
  return new Promise((resolve) => {
    try {
      const socket = tls.connect(443, domain, { servername: domain, timeout: 5000 }, () => {
        const cert = socket.getPeerCertificate();
        if (!cert || !cert.valid_to) {
          socket.end();
          return resolve({ success: false, error: 'No certificate' });
        }
        const validTo = new Date(cert.valid_to);
        const daysRemaining = Math.round((validTo.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        socket.end();
        resolve({
          success: daysRemaining > 0,
          daysRemaining,
          validTo: cert.valid_to,
          issuer: cert.issuer?.O || cert.issuer?.CN,
          subject: cert.subject?.CN
        });
      });
      socket.on('error', (err) => resolve({ success: false, error: err.message }));
      socket.on('timeout', () => {
        socket.destroy();
        resolve({ success: false, error: 'TLS connection timeout' });
      });
    } catch (err) {
      resolve({ success: false, error: err.message });
    }
  });
}

// Direct In-Process API Mock Runner for /api/register
export async function invokeRegisterHandler(body = null, method = 'POST', headers = {}) {
  // Import handler dynamically (supports both .ts and .js)
  const tsPath = path.resolve(ROOT_DIR, 'api/register.ts');
  const jsPath = path.resolve(ROOT_DIR, 'api/register.js');
  const handlerPath = fs.existsSync(tsPath) ? tsPath : jsPath;
  if (!fs.existsSync(handlerPath)) {
    throw new Error(`api/register.(ts|js) not found at ${handlerPath}`);
  }

  // Cache buster for module if needed
  const module = await import(`file://${handlerPath}?t=${Date.now()}`);
  const handler = module.default;
  if (typeof handler !== 'function') {
    throw new Error('api/register.js does not export a default handler function');
  }

  let statusCode = 200;
  let responseData = null;
  const responseHeaders = {};

  const req = {
    method,
    headers: {
      'content-type': 'application/json',
      ...headers
    },
    body
  };

  const res = {
    setHeader(name, value) {
      responseHeaders[name.toLowerCase()] = value;
      return this;
    },
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      responseData = data;
      return this;
    },
    end() {
      return this;
    }
  };

  await handler(req, res);

  return {
    status: statusCode,
    headers: responseHeaders,
    json: responseData,
    body: typeof responseData === 'object' ? JSON.stringify(responseData) : String(responseData || '')
  };
}
