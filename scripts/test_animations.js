const { chromium } = require('playwright');
const path = require('path');

async function testAnimations() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // 1. Capture initial Hero state
  console.log('Capturing initial hero...');
  await page.screenshot({ path: 'public/media/anim-1-hero-slide1.png' });

  // 2. Click next slide arrow and capture mid/post slide
  console.log('Clicking Next slide arrow...');
  await page.hover('.pv-hero');
  await page.waitForTimeout(300);
  await page.click('.pv-hero__arrow--right');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'public/media/anim-2-hero-slide2.png' });

  // 3. Hover over a movie card to test hover animation (no clipping, button pop-in, 1.08 scale)
  console.log('Hovering over movie card in first row...');
  const firstCard = page.locator('.pv-card').first();
  await firstCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await firstCard.hover();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'public/media/anim-3-card-hover.png' });

  // 4. Test expanding search in navbar
  console.log('Testing expanding search bar...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.click('.pv-search-icon-btn');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'public/media/anim-4-navbar-search.png' });

  await browser.close();
  console.log('All animation test screenshots captured successfully!');
}

testAnimations().catch(err => {
  console.error('Error during animation test:', err);
  process.exit(1);
});
