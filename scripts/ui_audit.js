const { chromium } = require('playwright');
const fs = require('fs');

async function extractStyles(url, selectors, isMobile = false) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext(
    isMobile ? {
      viewport: { width: 390, height: 844 },
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
    } : {
      viewport: { width: 1440, height: 900 }
    }
  );
  
  const page = await context.newPage();
  
  // Set language to avoid regional redirects varying too much if possible
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9'
  });

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  } catch (e) {
    console.log(`Failed to fully load ${url} but continuing...`);
  }

  // A small wait to allow components to render
  await page.waitForTimeout(3000);

  const results = {};

  for (const [key, selectorInfo] of Object.entries(selectors)) {
    try {
      const { selector, properties } = selectorInfo;
      const el = await page.$(selector);
      if (el) {
        const styles = await page.evaluate(({ el, properties }) => {
          const compStyles = window.getComputedStyle(el);
          const res = {};
          properties.forEach(prop => {
            res[prop] = compStyles[prop];
          });
          return res;
        }, { el, properties });
        results[key] = styles;
      } else {
        results[key] = 'Element not found';
      }
    } catch (e) {
      results[key] = `Error: ${e.message}`;
    }
  }

  await browser.close();
  return results;
}

(async () => {
  const desktopSelectors = {
    'body': {
      selector: 'body',
      properties: ['background-color', 'color', 'font-family', 'font-size', 'line-height']
    },
    'navbar': {
      selector: 'nav, header, [data-testid="header"]', // need a generic enough selector for real site vs ours
      properties: ['height', 'background-color', 'padding', 'display', 'align-items', 'justify-content']
    },
    'hero-title': {
      selector: 'h1',
      properties: ['font-size', 'font-weight', 'line-height', 'letter-spacing', 'color']
    },
    'primary-button': {
      selector: 'a[href*="/signup"], button, .pv-btn, .dv-copy-button', 
      properties: ['background-color', 'color', 'border-radius', 'padding', 'font-size', 'font-weight', 'height']
    }
  };

  console.log("Starting Audit...");

  console.log("Extracting styles from official Prime Video (Desktop)...");
  // The real site is www.primevideo.com
  const officialDesktop = await extractStyles('https://www.primevideo.com/', desktopSelectors, false);
  
  console.log("Extracting styles from Local Clone (Desktop)...");
  const localDesktop = await extractStyles('http://localhost:3000/', {
    'body': { selector: 'body', properties: desktopSelectors['body'].properties },
    'navbar': { selector: '.pv-navbar', properties: desktopSelectors['navbar'].properties },
    'hero-title': { selector: '.pv-hero-content h1', properties: desktopSelectors['hero-title'].properties },
    'primary-button': { selector: '.pv-btn-primary', properties: desktopSelectors['primary-button'].properties }
  }, false);

  const report = {
    official: officialDesktop,
    local: localDesktop
  };

  fs.writeFileSync('audit_results.json', JSON.stringify(report, null, 2));
  console.log("Audit complete. Results written to audit_results.json");
})();
