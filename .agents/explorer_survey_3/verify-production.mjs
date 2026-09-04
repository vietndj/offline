import https from 'https';
import tls from 'tls';
import dns from 'dns/promises';

const DOMAIN = 'offline.fedu.vn';
const BASE_URL = `https://${DOMAIN}`;

async function runVerification() {
  console.log(`=======================================================`);
  console.log(`🚀 VERIFYING PRODUCTION DEPLOYMENT: ${BASE_URL}`);
  console.log(`=======================================================\n`);

  const results = {
    dns: false,
    ssl: false,
    http200: false,
    assets: false,
    apiHealth: false,
    seoTags: {
      title: false,
      description: false,
      canonical: false,
      ogTitle: false,
      ogDescription: false,
      ogImage: false,
      twitterCard: false,
    },
    robotsTxt: false
  };

  // 1. DNS Check
  try {
    const addresses = await dns.resolve4(DOMAIN);
    console.log(`✅ [DNS] Resolved ${DOMAIN} -> ${addresses.join(', ')}`);
    results.dns = true;
  } catch (err) {
    console.log(`❌ [DNS] Resolution failed: ${err.message}`);
  }

  // 2. SSL Check
  try {
    await new Promise((resolve, reject) => {
      const socket = tls.connect(443, DOMAIN, { servername: DOMAIN }, () => {
        const cert = socket.getPeerCertificate();
        const validTo = new Date(cert.valid_to);
        const daysRemaining = Math.round((validTo.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        console.log(`✅ [SSL] Certificate valid for ${DOMAIN}`);
        console.log(`   - Subject: ${cert.subject.CN}`);
        console.log(`   - Issuer: ${cert.issuer.O} (${cert.issuer.CN})`);
        console.log(`   - Valid to: ${cert.valid_to} (${daysRemaining} days remaining)`);
        socket.end();
        results.ssl = daysRemaining > 0;
        resolve();
      });
      socket.on('error', reject);
    });
  } catch (err) {
    console.log(`❌ [SSL] Check failed: ${err.message}`);
  }

  // Helper fetch
  const fetchUrl = async (url) => {
    const res = await fetch(url);
    const body = await res.text();
    return { status: res.status, headers: res.headers, body };
  };

  // 3. Homepage HTTP 200 & SEO Meta Tags
  try {
    const home = await fetchUrl(BASE_URL);
    if (home.status === 200) {
      console.log(`✅ [HTTP] Homepage returned 200 OK (${home.body.length} bytes)`);
      results.http200 = true;

      const html = home.body;
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      if (titleMatch) {
        console.log(`   - Title: "${titleMatch[1]}"`);
        results.seoTags.title = true;
      } else {
        console.log(`   ❌ Title missing!`);
      }

      const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
      if (descMatch) {
        console.log(`   - Meta Description: "${descMatch[1].slice(0, 60)}..."`);
        results.seoTags.description = true;
      } else {
        console.log(`   ❌ Meta Description missing!`);
      }

      const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
      if (canonicalMatch) {
        console.log(`   - Canonical: ${canonicalMatch[1]}`);
        results.seoTags.canonical = true;
      } else {
        console.log(`   ❌ Canonical URL missing!`);
      }

      const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
      if (ogTitle) {
        console.log(`   - OG Title: "${ogTitle[1]}"`);
        results.seoTags.ogTitle = true;
      } else {
        console.log(`   ❌ og:title missing!`);
      }

      const ogDesc = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
      if (ogDesc) {
        console.log(`   - OG Description: "${ogDesc[1].slice(0, 60)}..."`);
        results.seoTags.ogDescription = true;
      } else {
        console.log(`   ❌ og:description missing!`);
      }

      const ogImage = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
      if (ogImage) {
        console.log(`   - OG Image: ${ogImage[1]}`);
        results.seoTags.ogImage = true;
      } else {
        console.log(`   ❌ og:image missing!`);
      }

      const twCard = html.match(/<meta\s+name=["']twitter:card["']\s+content=["']([^"']+)["']/i);
      if (twCard) {
        console.log(`   - Twitter Card: ${twCard[1]}`);
        results.seoTags.twitterCard = true;
      } else {
        console.log(`   ❌ twitter:card missing!`);
      }
    } else {
      console.log(`❌ [HTTP] Homepage returned status ${home.status}`);
    }
  } catch (err) {
    console.log(`❌ [HTTP] Homepage check failed: ${err.message}`);
  }

  // 4. Check Robots.txt
  try {
    const robots = await fetchUrl(`${BASE_URL}/robots.txt`);
    if (robots.status === 200 && robots.body.includes('User-agent:')) {
      console.log(`✅ [Robots.txt] Returned 200 OK:\n   ${robots.body.trim().replace(/\n/g, '\n   ')}`);
      results.robotsTxt = true;
    } else {
      console.log(`❌ [Robots.txt] Invalid status ${robots.status}`);
    }
  } catch (err) {
    console.log(`❌ [Robots.txt] Check failed: ${err.message}`);
  }

  // 5. Assets Check (Favicon, OG Image)
  try {
    const [fav, og] = await Promise.all([
      fetchUrl(`${BASE_URL}/favicon.svg`),
      fetchUrl(`${BASE_URL}/opengraph.jpg`)
    ]);
    if (fav.status === 200 && og.status === 200) {
      console.log(`✅ [Assets] favicon.svg (200) and opengraph.jpg (200) available`);
      results.assets = true;
    } else {
      console.log(`❌ [Assets] favicon status: ${fav.status}, opengraph status: ${og.status}`);
    }
  } catch (err) {
    console.log(`❌ [Assets] Check failed: ${err.message}`);
  }

  // 6. API Health Check
  try {
    const api = await fetchUrl(`${BASE_URL}/api/register`);
    if (api.status === 200) {
      const data = JSON.parse(api.body);
      console.log(`✅ [API] GET /api/register returned 200 healthy:`);
      console.log(`   - Service: ${data.service}`);
      console.log(`   - Sheet: ${data.sheet}`);
      results.apiHealth = true;
    } else {
      console.log(`❌ [API] GET /api/register returned ${api.status}`);
    }
  } catch (err) {
    console.log(`❌ [API] GET /api/register check failed: ${err.message}`);
  }

  console.log(`\n=======================================================`);
  console.log(`📊 SUMMARY OF AUDIT:`);
  console.log(`- DNS Resolution: ${results.dns ? 'PASS' : 'FAIL'}`);
  console.log(`- SSL Certificate: ${results.ssl ? 'PASS' : 'FAIL'}`);
  console.log(`- Homepage HTTP 200: ${results.http200 ? 'PASS' : 'FAIL'}`);
  console.log(`- Key Assets (favicon, opengraph): ${results.assets ? 'PASS' : 'FAIL'}`);
  console.log(`- Robots.txt: ${results.robotsTxt ? 'PASS' : 'FAIL'}`);
  console.log(`- API Health Endpoint: ${results.apiHealth ? 'PASS' : 'FAIL'}`);
  console.log(`- SEO Title: ${results.seoTags.title ? 'PASS' : 'FAIL'}`);
  console.log(`- SEO Description: ${results.seoTags.description ? 'PASS' : 'FAIL'}`);
  console.log(`- SEO Canonical: ${results.seoTags.canonical ? 'PASS' : 'FAIL (NEEDS FIX)'}`);
  console.log(`- OpenGraph Title: ${results.seoTags.ogTitle ? 'PASS' : 'FAIL (NEEDS FIX)'}`);
  console.log(`- OpenGraph Description: ${results.seoTags.ogDescription ? 'PASS' : 'FAIL (NEEDS FIX)'}`);
  console.log(`- OpenGraph Image: ${results.seoTags.ogImage ? 'PASS' : 'FAIL (NEEDS FIX)'}`);
  console.log(`- Twitter Card: ${results.seoTags.twitterCard ? 'PASS' : 'FAIL (NEEDS FIX)'}`);
  console.log(`=======================================================\n`);
}

runVerification().catch(console.error);
