const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (!url || !url.startsWith('http')) return resolve(null);
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return resolve(null);
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(dest);
      });
    }).on('error', (err) => {
      resolve(null);
    });
  });
}

async function scrape() {
  console.log('Launching Chrome browser via Playwright...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();
  console.log('Navigating to https://www.primevideo.com...');
  await page.goto('https://www.primevideo.com', { waitUntil: 'networkidle', timeout: 45000 }).catch(e => {
    console.log('Networkidle timeout, continuing with current DOM state...');
  });

  await page.waitForTimeout(3000);

  // Take screenshot of official page for R&D comparison
  const screenshotDir = path.join('C:', 'Users', 'kk701', '.gemini', 'antigravity-ide', 'brain', '76f81dd7-6221-4355-974f-204f280ea615');
  const screenshotPath = path.join(screenshotDir, 'prime_official_landing.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('Captured official Prime Video screenshot at:', screenshotPath);

  // Extract page metadata, sections and images
  const pageData = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt || '',
      width: img.naturalWidth || img.width,
      height: img.naturalHeight || img.height,
      className: img.className
    })).filter(img => img.src && !img.src.startsWith('data:'));

    // Check background images in styles
    const bgElements = Array.from(document.querySelectorAll('*')).filter(el => {
      const bg = window.getComputedStyle(el).backgroundImage;
      return bg && bg.startsWith('url(') && !bg.includes('data:');
    }).map(el => {
      const bg = window.getComputedStyle(el).backgroundImage;
      const match = bg.match(/url\(['"]?(.*?)['"]?\)/);
      return match ? match[1] : null;
    }).filter(Boolean);

    // Extract text content of main sections
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(h => ({
      tag: h.tagName,
      text: h.innerText.trim()
    })).filter(h => h.text.length > 0);

    const buttons = Array.from(document.querySelectorAll('button, a[role="button"], a.pv-button, a[data-testid]')).map(b => ({
      text: b.innerText.trim(),
      href: b.href || ''
    })).filter(b => b.text.length > 0);

    return {
      title: document.title,
      headings,
      buttons,
      images,
      backgroundImages: Array.from(new Set(bgElements))
    };
  });

  console.log('Scraped Page Title:', pageData.title);
  console.log('Found headings count:', pageData.headings.length);
  console.log('Found buttons count:', pageData.buttons.length);
  console.log('Found images count:', pageData.images.length);
  console.log('Found background images count:', pageData.backgroundImages.length);

  fs.writeFileSync('scraped_prime_data.json', JSON.stringify(pageData, null, 2));
  console.log('Saved scraped_prime_data.json');

  // Ensure public/media directory exists
  const mediaDir = path.join(__dirname, '..', 'public', 'media');
  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true });
  }

  // Filter and download high quality movie posters / banners
  const uniqueUrls = Array.from(new Set([
    ...pageData.images.map(i => i.src),
    ...pageData.backgroundImages
  ])).filter(url => url.includes('media-amazon.com') || url.includes('ssl-images-amazon.com'));

  console.log('Found ' + uniqueUrls.length + ' Amazon CDN assets to download...');

  let downloadedCount = 0;
  for (let i = 0; i < uniqueUrls.length && downloadedCount < 25; i++) {
    const url = uniqueUrls[i];
    const ext = url.includes('.png') ? '.png' : url.includes('.svg') ? '.svg' : '.jpg';
    const filename = `prime_official_${downloadedCount + 1}${ext}`;
    const dest = path.join(mediaDir, filename);

    const saved = await downloadFile(url, dest);
    if (saved) {
      console.log(`[${downloadedCount + 1}] Downloaded: ${filename} from ${url.substring(0, 80)}...`);
      downloadedCount++;
    }
  }

  console.log(`Successfully downloaded ${downloadedCount} official Prime Video assets to public/media/`);
  await browser.close();
}

scrape().catch(err => {
  console.error('Scraping error:', err);
  process.exit(1);
});
