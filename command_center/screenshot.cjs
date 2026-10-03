const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 }
  });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:9000/', {waitUntil: 'networkidle2'});
  
  // Wait a bit for data to load
  await new Promise(r => setTimeout(r, 2000));
  
  // Close the identity modal if it's open (just click somewhere or check if it exists)
  await page.evaluate(() => {
     // If there is an identity modal, maybe set the localStorage and reload
     if (!localStorage.getItem('fedu_sales_id')) {
         localStorage.setItem('fedu_sales_id', 'Test User');
         location.reload();
     }
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  await page.screenshot({path: '/Users/vietmac/Documents/CODE/offline/command_center/dashboard_with_qr.png'});
  
  await browser.close();
})();
