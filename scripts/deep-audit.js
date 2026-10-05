const http = require('http');

const routes = [
  '/',
  '/login',
  '/movies',
  '/tv-shows',
  '/free-to-me',
  '/sports',
  '/news',
  '/live-tv',
  '/subscriptions',
  '/store',
  '/blog',
  '/robots.txt',
  '/sitemap.xml',
  '/llms.txt',
  '/admin',
  '/admin/login',
  '/admin/blog',
  '/api/blog',
  '/non-existent-page-test-404'
];

async function inspectRoute(path) {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = http.get(`http://localhost:3000${path}`, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const ms = Date.now() - start;
        const isHtml = (res.headers['content-type'] || '').includes('text/html');
        
        let audit = {
          path,
          status: res.statusCode,
          ms,
          contentType: res.headers['content-type'] || '',
          location: res.headers['location'] || null,
          contentLength: body.length
        };

        if (isHtml) {
          // Title
          const title = body.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
          audit.title = title ? title[1].trim() : null;
          audit.titleLength = audit.title ? audit.title.length : 0;

          // Meta Description
          const desc = body.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
          audit.description = desc ? desc[1].trim() : null;
          audit.descLength = audit.description ? audit.description.length : 0;

          // Canonical
          const canonical = body.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
          audit.canonical = canonical ? canonical[1] : null;

          // Robots Meta
          const robots = body.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i);
          audit.robots = robots ? robots[1] : null;

          // Viewport
          const viewport = body.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']*)["']/i);
          audit.hasViewport = !!viewport;

          // H1 tags
          const h1s = body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
          audit.h1Count = h1s.length;
          audit.h1Texts = h1s.map(h => h.replace(/<[^>]+>/g, '').trim());

          // H2 tags
          const h2s = body.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || [];
          audit.h2Count = h2s.length;

          // Images without alt
          const imgs = body.match(/<img[^>]*>/gi) || [];
          audit.imgCount = imgs.length;
          audit.imgsWithoutAlt = imgs.filter(img => !img.includes('alt=') || img.includes('alt=""') || img.includes("alt=''")).length;

          // JSON-LD Structured Data
          const jsonLdMatches = body.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
          audit.jsonLdCount = jsonLdMatches.length;
          audit.schemas = [];
          jsonLdMatches.forEach(script => {
            try {
              const parsed = JSON.parse(script.replace(/<[^>]+>/g, ''));
              if (parsed['@graph']) {
                audit.schemas.push(...parsed['@graph'].map(g => g['@type']));
              } else if (parsed['@type']) {
                audit.schemas.push(parsed['@type']);
              }
            } catch (e) {
              audit.schemas.push('INVALID_JSON');
            }
          });

          // Check for "trial" keyword in user facing text
          const bodyTextOnly = body.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                                   .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                                   .replace(/<[^>]+>/g, ' ');
          audit.hasTrialMention = /free trial|30-day trial|start your trial/i.test(bodyTextOnly);
        }

        resolve(audit);
      });
    });

    req.on('error', (err) => {
      resolve({ path, error: err.message });
    });
  });
}

(async () => {
  console.log('Starting Deep Website Audit...\n');
  const results = [];
  for (const r of routes) {
    const res = await inspectRoute(r);
    results.push(res);
  }
  console.log(JSON.stringify(results, null, 2));
})();
