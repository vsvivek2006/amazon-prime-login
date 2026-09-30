const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  console.log("Navigating to Amazon Prime Video Storefront...");
  
  try {
    await page.goto('https://www.amazon.com/gp/video/storefront', { waitUntil: 'domcontentloaded', timeout: 60000 });
  } catch (e) {
    console.log("Navigation timeout or error, proceeding anyway...");
  }

  // Wait a bit for initial load
  await page.waitForTimeout(5000);

  console.log("Scrolling down to trigger infinite scrolling...");
  // Infinite scroll
  let previousHeight = 0;
  for (let i = 0; i < 8; i++) {
    const currentHeight = await page.evaluate(() => document.body.scrollHeight);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(3000);
    
    const newHeight = await page.evaluate(() => document.body.scrollHeight);
    if (newHeight === currentHeight) {
      break; // reached the bottom
    }
    console.log(`Scrolled down, iteration ${i+1}`);
  }

  console.log("Extracting content...");
  // Extract content
  const data = await page.evaluate(() => {
    const result = {
      hero: [],
      rows: []
    };
    
    // Extract rows (carousels)
    const rowElements = document.querySelectorAll('.tst-collection');
    if (rowElements.length === 0) {
      // Fallback selector for different layout
      const alternativeRows = document.querySelectorAll('.av-storefront-carousel');
      alternativeRows.forEach(row => {
        const titleEl = row.querySelector('h2');
        const title = titleEl ? titleEl.innerText : 'Unknown Category';
        const movies = [];
        
        row.querySelectorAll('img').forEach(img => {
          if (img.src && img.src.includes('images')) {
            movies.push({ image: img.src, alt: img.alt });
          }
        });
        
        if (movies.length > 0) {
          result.rows.push({ title, movies });
        }
      });
    } else {
      rowElements.forEach(row => {
        const titleEl = row.querySelector('h2');
        const title = titleEl ? titleEl.innerText : 'Unknown Category';
        const movies = [];
        
        row.querySelectorAll('img').forEach(img => {
          if (img.src && img.src.includes('images')) {
            movies.push({ image: img.src, alt: img.alt });
          }
        });
        
        if (movies.length > 0) {
          result.rows.push({ title, movies });
        }
      });
    }
    
    return result;
  });

  fs.writeFileSync('amazon_scraped_live.json', JSON.stringify(data, null, 2));
  console.log(`Scraped ${data.rows.length} rows of content. Saved to amazon_scraped_live.json`);

  await browser.close();
})();
