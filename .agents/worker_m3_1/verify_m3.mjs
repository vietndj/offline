import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

console.log('--- Checking index.html and dist/index.html ---');
for (const filePath of ['index.html', 'dist/index.html']) {
  const fullPath = path.join(ROOT_DIR, filePath);
  assert(fs.existsSync(fullPath), `${filePath} exists`);
  const html = fs.readFileSync(fullPath, 'utf8');

  assert(/<html[^>]*lang=["']vi["']/i.test(html), `${filePath} has <html lang="vi">`);
  assert(/<title>Khóa Học Offline Video Marketing 2 Ngày Tại Hà Nội \| FEDU<\/title>/i.test(html), `${filePath} has correct <title>`);
  assert(/<link\s+rel=["']canonical["']\s+href=["']https:\/\/offline\.fedu\.vn\/["']/i.test(html), `${filePath} has canonical link to https://offline.fedu.vn/`);
  assert(/<meta\s+name=["']description["']\s+content=["'][^"']+["']/i.test(html), `${filePath} has meta description`);
  assert(/<meta\s+property=["']og:type["']\s+content=["']website["']/i.test(html), `${filePath} has og:type website`);
  assert(/<meta\s+property=["']og:url["']\s+content=["']https:\/\/offline\.fedu\.vn\/["']/i.test(html), `${filePath} has og:url https://offline.fedu.vn/`);
  assert(/<meta\s+property=["']og:title["']\s+content=["']Khóa Học Offline Video Marketing 2 Ngày Tại Hà Nội \| FEDU["']/i.test(html), `${filePath} has og:title`);
  assert(/<meta\s+property=["']og:image["']\s+content=["']https:\/\/offline\.fedu\.vn\/opengraph\.jpg["']/i.test(html), `${filePath} has og:image`);
  assert(/<meta\s+property=["']og:locale["']\s+content=["']vi_VN["']/i.test(html), `${filePath} has og:locale vi_VN`);
  assert(/<meta\s+property=["']og:site_name["']\s+content=["']FEDU Offline["']/i.test(html), `${filePath} has og:site_name`);
  assert(/<meta\s+name=["']twitter:card["']\s+content=["']summary_large_image["']/i.test(html), `${filePath} has twitter:card summary_large_image`);
  assert(/<meta\s+name=["']twitter:image["']\s+content=["']https:\/\/offline\.fedu\.vn\/opengraph\.jpg["']/i.test(html), `${filePath} has twitter:image`);
  assert(/<link\s+rel=["']icon["']\s+type=["']image\/svg\+xml["']\s+href=["']\/favicon\.svg["']/i.test(html), `${filePath} has favicon.svg link`);
}

console.log('\n--- Checking public/robots.txt and dist/robots.txt ---');
for (const filePath of ['public/robots.txt', 'dist/robots.txt']) {
  const fullPath = path.join(ROOT_DIR, filePath);
  assert(fs.existsSync(fullPath), `${filePath} exists`);
  const content = fs.readFileSync(fullPath, 'utf8');

  assert(content.includes('User-agent: *'), `${filePath} contains User-agent: *`);
  assert(content.includes('Allow: /'), `${filePath} contains Allow: /`);
  assert(content.includes('Disallow: /api/'), `${filePath} contains Disallow: /api/`);
  assert(content.includes('Sitemap: https://offline.fedu.vn/sitemap.xml'), `${filePath} contains Sitemap link`);
}

console.log('\n--- Checking public/favicon.svg and dist/favicon.svg ---');
for (const filePath of ['public/favicon.svg', 'dist/favicon.svg']) {
  const fullPath = path.join(ROOT_DIR, filePath);
  assert(fs.existsSync(fullPath), `${filePath} exists`);
  const svg = fs.readFileSync(fullPath, 'utf8');

  assert(!svg.includes('>30D<'), `${filePath} does NOT contain legacy 30D badge`);
  assert(svg.includes('>FEDU<'), `${filePath} contains standardized FEDU branding`);
}

console.log('\n--- Checking opengraph.jpg existence in public and dist ---');
for (const filePath of ['public/opengraph.jpg', 'dist/opengraph.jpg']) {
  const fullPath = path.join(ROOT_DIR, filePath);
  assert(fs.existsSync(fullPath), `${filePath} exists`);
}

if (!process.exitCode) {
  console.log('\n🎉 ALL M3 VERIFICATION CHECKS PASSED!');
} else {
  console.error('\n❌ SOME VERIFICATION CHECKS FAILED!');
}
