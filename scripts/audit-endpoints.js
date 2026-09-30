const http = require('http');

const endpoints = [
  { url: 'http://localhost:3000/', expected: 200 },
  { url: 'http://localhost:3000/movies', expected: 200 },
  { url: 'http://localhost:3000/tv-shows', expected: 200 },
  { url: 'http://localhost:3000/free-to-me', expected: 200 },
  { url: 'http://localhost:3000/sports', expected: 200 },
  { url: 'http://localhost:3000/news', expected: 200 },
  { url: 'http://localhost:3000/live-tv', expected: 200 },
  { url: 'http://localhost:3000/subscriptions', expected: 200 },
  { url: 'http://localhost:3000/store', expected: 200 },
  { url: 'http://localhost:3000/login', expected: 200 },
  { url: 'http://localhost:3000/robots.txt', expected: 200 },
  { url: 'http://localhost:3000/sitemap.xml', expected: 200 },
  { url: 'http://localhost:3000/llms.txt', expected: 200 },
  { url: 'http://localhost:3000/unknown-random-test-route', expected: 404 },
];

async function checkUrl(item) {
  return new Promise((resolve) => {
    const start = Date.now();
    http.get(item.url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const ms = Date.now() - start;
        const pass = res.statusCode === item.expected;
        resolve({
          url: item.url,
          status: res.statusCode,
          expected: item.expected,
          pass,
          ms,
          hasH1: data.includes('<h1'),
          hasJsonLd: data.includes('application/ld+json'),
          length: data.length,
          snippet: data.slice(0, 100).replace(/\n/g, ' ')
        });
      });
    }).on('error', (err) => {
      resolve({ url: item.url, error: err.message, pass: false });
    });
  });
}

(async () => {
  console.log('Testing all endpoints on http://localhost:3000...\n');
  const results = [];
  for (const item of endpoints) {
    const res = await checkUrl(item);
    results.push(res);
    console.log(`${res.pass ? '✅' : '❌'} [${res.status}] in ${res.ms}ms: ${res.url}`);
    if (res.hasH1) console.log('   ↳ H1 detected: YES');
    if (res.hasJsonLd) console.log('   ↳ JSON-LD detected: YES');
  }

  const allPassed = results.every(r => r.pass);
  console.log('\n================================');
  console.log('Overall Status:', allPassed ? 'ALL PASSED 🎉' : 'SOME FAILED ⚠️');
  console.log('================================');
})();
