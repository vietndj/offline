import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1080 });
  
  await page.goto('https://offline.fedu.vn/', { waitUntil: 'domcontentloaded' });
  
  // Wait a bit for images to load
  await new Promise(r => setTimeout(r, 3000));
  
  await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('*'));
    const target = elements.find(el => el.textContent && el.textContent.includes('Tâng Xinh') && el.tagName === 'DIV');
    if (target) {
        target.scrollIntoView({ block: 'center' });
    }
  });

  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: 'showcase_screenshot.png' });
  await browser.close();
  console.log("Screenshot taken: showcase_screenshot.png");
})();
