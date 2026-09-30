const { chromium } = require('playwright');
const path = require('path');

async function verify() {
  console.log('Launching Playwright Chrome to verify Prime Video landing page...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  });

  const artifactDir = path.join('C:', 'Users', 'kk701', '.gemini', 'antigravity-ide', 'brain', '76f81dd7-6221-4355-974f-204f280ea615');

  // 1. Desktop Viewport (1440x900)
  console.log('Testing Desktop Viewport (1440x900)...');
  const contextDesktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pageDesktop = await contextDesktop.newPage();
  await pageDesktop.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await pageDesktop.waitForTimeout(2000);

  await pageDesktop.screenshot({ path: path.join(artifactDir, 'prime_desktop_hero.png'), fullPage: false });
  console.log('Saved prime_desktop_hero.png');

  await pageDesktop.screenshot({ path: path.join(artifactDir, 'prime_desktop_fullpage.png'), fullPage: true });
  console.log('Saved prime_desktop_fullpage.png');

  // Test interactive trailer modal
  console.log('Opening Trailer Modal...');
  await pageDesktop.click('#hero-watch-trailer-btn');
  await pageDesktop.waitForTimeout(1000);
  await pageDesktop.screenshot({ path: path.join(artifactDir, 'prime_trailer_modal.png') });
  console.log('Saved prime_trailer_modal.png');

  await pageDesktop.click('.pv-modal-close');
  await pageDesktop.waitForTimeout(500);

  // Test interactive Auth Modal
  console.log('Opening Join Prime Auth Modal...');
  await pageDesktop.click('.pv-btn-join');
  await pageDesktop.waitForTimeout(1000);
  await pageDesktop.screenshot({ path: path.join(artifactDir, 'prime_auth_modal.png') });
  console.log('Saved prime_auth_modal.png');

  await pageDesktop.click('.pv-modal-close');
  await pageDesktop.waitForTimeout(500);

  // 2. Tablet Viewport (768x1024)
  console.log('Testing Tablet Viewport (768x1024)...');
  const contextTablet = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  const pageTablet = await contextTablet.newPage();
  await pageTablet.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await pageTablet.waitForTimeout(1500);
  await pageTablet.screenshot({ path: path.join(artifactDir, 'prime_tablet_view.png'), fullPage: false });
  console.log('Saved prime_tablet_view.png');

  // 3. Mobile Viewport (390x844)
  console.log('Testing Mobile Viewport (390x844)...');
  const contextMobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await pageMobile.waitForTimeout(1500);
  await pageMobile.screenshot({ path: path.join(artifactDir, 'prime_mobile_view.png'), fullPage: false });
  console.log('Saved prime_mobile_view.png');

  // Open mobile drawer
  console.log('Testing Mobile Drawer...');
  await pageMobile.click('.pv-mobile-toggle');
  await pageMobile.waitForTimeout(500);
  await pageMobile.screenshot({ path: path.join(artifactDir, 'prime_mobile_drawer.png'), fullPage: false });
  console.log('Saved prime_mobile_drawer.png');

  await browser.close();
  console.log('All Playwright verifications passed successfully!');
}

verify().catch(e => {
  console.error('Verification failed:', e);
  process.exit(1);
});
