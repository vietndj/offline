const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
  // Use local Chrome installation
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new'
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  await page.goto('http://localhost:9000/', {waitUntil: 'networkidle2'});
  
  // click the AI tab
  await page.evaluate(() => {
     const tabs = document.querySelectorAll('.tab-item');
     for (let tab of tabs) {
       if (tab.innerText.includes('Thư Viện Kịch Bản')) {
          tab.click();
       }
     }
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  const content = await page.evaluate(() => {
     const tab = document.querySelector('.max-w-4xl.mx-auto');
     return tab ? tab.innerHTML : 'NOT FOUND';
  });
  console.log('CONTENT:', content.substring(0, 500));
  
  await page.screenshot({path: 'screenshot.png'});
  
  await browser.close();
})();
