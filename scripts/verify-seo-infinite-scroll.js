const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testFullExperience() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const failedRequests = [];
  const consoleErrors = [];

  page.on('requestfailed', request => {
    // Ignore aborted analytics or telemetry
    if (!request.url().includes('telemetry')) {
      failedRequests.push(`${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
    }
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  console.log('1. Navigating to http://localhost:3000/...');
  const navStart = Date.now();
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  const domTime = Date.now() - navStart;
  console.log(`DOM ready in ${domTime}ms`);

  // Verify H1 presence
  const h1Text = await page.textContent('h1');
  console.log('Semantic H1 present:', h1Text ? `"${h1Text.trim()}"` : 'NONE');

  // Verify Initial Row Count
  await page.waitForSelector('.pv-section-row');
  const initialRowCount = await page.locator('.pv-section-row').count();
  console.log('Initial rendered movie rows count:', initialRowCount);

  // Progressive Scroll Test (controlled batches)
  console.log('2. Scrolling down towards sentinel...');
  await page.evaluate(() => window.scrollBy(0, 1500));
  await page.waitForTimeout(800);
  const rowCountAfterScroll1 = await page.locator('.pv-section-row').count();
  console.log('Row count after scroll 1:', rowCountAfterScroll1);

  await page.evaluate(() => window.scrollBy(0, 1500));
  await page.waitForTimeout(800);
  const rowCountAfterScroll2 = await page.locator('.pv-section-row').count();
  console.log('Row count after scroll 2:', rowCountAfterScroll2);

  // Verify Footer
  const footerLogo = await page.locator('.pv-footer-logo').isVisible();
  console.log('Footer logo visible:', footerLogo);

  // Test Movies tab navigation
  console.log('3. Clicking Movies navigation link...');
  await page.click('a[href="/movies"]');
  await page.waitForTimeout(500);
  console.log('Current URL after clicking Movies:', page.url());

  // Test TV Shows navigation
  console.log('4. Clicking TV shows navigation link...');
  await page.click('a[href="/tv-shows"]');
  await page.waitForTimeout(500);
  console.log('Current URL after clicking TV shows:', page.url());

  // Test 404 page
  console.log('5. Navigating to non-existent route...');
  await page.goto('http://localhost:3000/random-missing-page-test');
  const notFoundHeading = await page.textContent('h1');
  console.log('404 Heading:', notFoundHeading);
  const backHomeBtn = await page.locator('a:has-text("Go to Prime Video Home")').isVisible();
  console.log('Go to Home CTA button visible:', backHomeBtn);

  // Summary
  console.log('\n================================');
  console.log('Failed HTTP requests count:', failedRequests.length);
  if (failedRequests.length > 0) {
    console.log('Failed requests:', failedRequests.slice(0, 5));
  }
  console.log('Console errors count:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log('Console errors:', consoleErrors.slice(0, 5));
  }
  console.log('================================\n');

  await browser.close();
}

testFullExperience().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
