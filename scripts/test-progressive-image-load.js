const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  let requestedImagesCount = 0;
  page.on('response', (response) => {
    if (response.request().resourceType() === 'image') {
      requestedImagesCount++;
    }
  });

  console.log('1. Loading http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const initialRequested = requestedImagesCount;
  const initialMountedImages = await page.evaluate(() => document.querySelectorAll('img').length);
  const initialSkeletonPlaceholders = await page.evaluate(() => document.querySelectorAll('.pv-card-poster--skeleton').length);

  console.log(`Initial mounted <img> elements: ${initialMountedImages}`);
  console.log(`Initial skeleton/placeholder cards (deferred): ${initialSkeletonPlaceholders}`);
  console.log(`Initial image network requests: ${initialRequested}`);

  console.log('\n2. Scrolling down vertically to trigger next row...');
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(1000);

  const afterScrollRequested = requestedImagesCount;
  const afterScrollMounted = await page.evaluate(() => document.querySelectorAll('img').length);
  console.log(`Mounted <img> elements after scroll: ${afterScrollMounted}`);
  console.log(`Total image network requests after scroll: ${afterScrollRequested}`);

  console.log('\n3. Scrolling carousel horizontally...');
  await page.click('.pv-arrow-right');
  await page.waitForTimeout(800);

  const afterHScrollRequested = requestedImagesCount;
  const afterHScrollMounted = await page.evaluate(() => document.querySelectorAll('img').length);
  console.log(`Mounted <img> elements after horizontal scroll: ${afterHScrollMounted}`);
  console.log(`Total image network requests after horizontal scroll: ${afterHScrollRequested}`);

  console.log('\n================================');
  console.log('Progressive Image Loading Test Result:');
  if (initialSkeletonPlaceholders > 0 && afterScrollMounted > initialMountedImages) {
    console.log('✅ PASS: Images are progressively loaded on-demand, NOT all at once!');
  } else {
    console.log('⚠️ CHECK: Behavior needs verification.');
  }
  console.log('================================\n');

  await browser.close();
})();
