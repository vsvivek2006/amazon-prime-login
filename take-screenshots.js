const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://localhost:3000');
  
  // Wait for images to load
  await page.waitForTimeout(2000);
  
  // Desktop Screenshot
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.screenshot({ path: 'desktop.png', fullPage: true });
  
  // Tablet Screenshot
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.screenshot({ path: 'tablet.png', fullPage: true });
  
  // Mobile Screenshot
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: 'mobile.png', fullPage: true });

  await browser.close();
  console.log('Screenshots taken successfully.');
})();
