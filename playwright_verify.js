const { chromium } = require('./node_modules/playwright');
const path = require('path');
const fs = require('fs');

async function verify() {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });

  const page = await context.newPage();

  const screenshotDir = path.join('C:', 'Users', 'kk701', '.gemini', 'antigravity-ide', 'brain', 'abc2f09f-e637-4dfb-9535-bd4bcb16fefc', 'scratch');

  // 1. Inspect desktop step 1
  console.log('Navigating to http://localhost:3002...');
  await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(screenshotDir, 'clone_desktop_step1.png'), fullPage: false });
  console.log('Saved clone_desktop_step1.png');

  // Trigger error state on clone
  await page.click('.amzn-btn-primary');
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(screenshotDir, 'clone_desktop_error.png') });
  console.log('Saved clone_desktop_error.png');

  // Type email and go to Step 2
  await page.fill('#ap_email', 'alex.smith@amazon.com');
  await page.click('.amzn-btn-primary');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotDir, 'clone_desktop_step2.png') });
  console.log('Saved clone_desktop_step2.png');

  // 2. Mobile viewport (natural responsive screen, no phone frame!)
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('http://localhost:3002', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(screenshotDir, 'clone_mobile.png'), fullPage: false });
  console.log('Saved clone_mobile.png');

  await browser.close();
  console.log('Verification run finished successfully.');
}

verify().catch(e => {
  console.error('Playwright error:', e);
  process.exit(1);
});
