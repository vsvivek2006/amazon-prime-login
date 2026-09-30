const { chromium } = require('playwright');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const MEDIA_DIR = path.join(__dirname, 'public', 'media');
if (!fs.existsSync(MEDIA_DIR)) fs.mkdirSync(MEDIA_DIR, { recursive: true });

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, {
      headers: {
        'Referer': 'https://www.amazon.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36'
      }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(res.statusCode); });
    }).on('error', (err) => { fs.unlink(dest, () => {}); reject(err); });
  });
}

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' }
  });

  const page = await context.newPage();
  const collectedImages = new Set();

  // Intercept all image requests
  page.on('response', async (response) => {
    const url = response.url();
    if (
      (url.includes('m.media-amazon.com') || url.includes('images-na.ssl-images-amazon.com')) &&
      (url.endsWith('.jpg') || url.endsWith('.png') || url.includes('FMjpg') || url.includes('FMpng'))
    ) {
      collectedImages.add(url);
    }
  });

  console.log('Navigating to Amazon Prime Video...');
  try {
    await page.goto('https://www.amazon.com/gp/video/storefront', {
      waitUntil: 'load',
      timeout: 60000
    });
  } catch (e) {
    console.log('Initial load timed out, continuing anyway...');
  }

  // Wait for page to render content
  await page.waitForTimeout(5000);

  // Scroll down slowly to trigger lazy image loading
  console.log('Scrolling to trigger lazy images...');
  for (let y = 0; y <= 5000; y += 400) {
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
    await page.waitForTimeout(600);
  }
  await page.waitForTimeout(3000);

  // Screenshot of hero section
  console.log('Taking hero screenshot...');
  await page.screenshot({ path: path.join(MEDIA_DIR, 'amazon-hero-screenshot.png'), fullPage: false });

  // Get all img src from the page
  const imgSrcs = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs.map(img => ({
      src: img.src || img.getAttribute('src') || '',
      alt: img.alt || '',
      width: img.naturalWidth || img.width,
      height: img.naturalHeight || img.height
    })).filter(i => i.src && i.src.includes('amazon'));
  });

  // Get background images from CSS
  const bgImgs = await page.evaluate(() => {
    const results = [];
    document.querySelectorAll('*').forEach(el => {
      const bg = window.getComputedStyle(el).backgroundImage;
      if (bg && bg !== 'none' && bg.includes('amazon')) {
        const match = bg.match(/url\(["']?([^"')]+)["']?\)/);
        if (match) results.push(match[1]);
      }
    });
    return results;
  });

  console.log(`\nFound ${imgSrcs.length} images on page`);
  console.log(`Found ${bgImgs.length} background images`);
  console.log(`Intercepted ${collectedImages.size} image requests`);

  // Save report
  const allImages = [
    ...imgSrcs.map(i => ({ ...i, type: 'img-tag' })),
    ...bgImgs.map(url => ({ src: url, type: 'bg-image', alt: 'background' })),
    ...[...collectedImages].map(url => ({ src: url, type: 'network', alt: 'network' }))
  ];

  fs.writeFileSync(
    path.join(MEDIA_DIR, 'amazon-images-list.json'),
    JSON.stringify(allImages, null, 2)
  );

  // Download the largest/most relevant images
  const heroImages = allImages
    .filter(i => i.src && i.src.length > 50)
    .filter(i => i.src.includes('m.media-amazon.com') || i.src.includes('images-na'))
    .slice(0, 30);

  console.log(`\nDownloading ${heroImages.length} images...`);
  let downloaded = 0;
  for (let i = 0; i < heroImages.length; i++) {
    const img = heroImages[i];
    try {
      // Make URL larger resolution
      let url = img.src
        .replace(/_SX\d+_/g, '_SX1080_')
        .replace(/_SY\d+_/g, '_SY1080_');
      const ext = url.includes('FMpng') || url.endsWith('.png') ? 'png' : 'jpg';
      const filename = `amazon-img-${String(i).padStart(3,'0')}.${ext}`;
      const dest = path.join(MEDIA_DIR, filename);
      const status = await downloadFile(url, dest);
      const size = fs.statSync(dest).size;
      if (size < 1000) {
        fs.unlinkSync(dest);
        console.log(`  [${i+1}] Skipped (too small): ${filename}`);
      } else {
        downloaded++;
        console.log(`  [${i+1}] Downloaded (${Math.round(size/1024)}kb): ${filename}`);
      }
    } catch (e) {
      console.log(`  [${i+1}] Error: ${e.message}`);
    }
  }

  // Also take full-page screenshot
  await page.screenshot({ path: path.join(MEDIA_DIR, 'amazon-fullpage.png'), fullPage: true });

  await browser.close();
  console.log(`\nDone! Downloaded ${downloaded} images to public/media/`);
  console.log('Image list saved to public/media/amazon-images-list.json');
})();
