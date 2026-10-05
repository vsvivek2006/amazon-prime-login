const http = require('http');

http.get('http://localhost:3000/login', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('=== SENIOR SEO AUDIT FOR /login ===');
    console.log('HTTP Status:', res.statusCode);
    console.log('Content-Type:', res.headers['content-type']);
    
    // Headings
    const h1Matches = body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
    console.log('\nH1 Count:', h1Matches.length);
    h1Matches.forEach((h, i) => console.log(`  H1 [${i+1}]:`, h.replace(/<[^>]+>/g, '').trim()));

    const h2Matches = body.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || [];
    console.log('\nH2 Count:', h2Matches.length);
    h2Matches.forEach((h, i) => console.log(`  H2 [${i+1}]:`, h.replace(/<[^>]+>/g, '').trim()));

    // Title & Meta
    const titleMatch = body.match(/<title>([\s\S]*?)<\/title>/i);
    console.log('\nPage Title:', titleMatch ? titleMatch[1] : 'MISSING');

    const descMatch = body.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
    console.log('Meta Description:', descMatch ? descMatch[1] : 'MISSING');

    const canonicalMatch = body.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
    console.log('Canonical Link:', canonicalMatch ? canonicalMatch[1] : 'MISSING');

    const robotsMatch = body.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i);
    console.log('Robots Meta:', robotsMatch ? robotsMatch[1] : 'MISSING');

    const ogTitle = body.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i);
    console.log('OG Title:', ogTitle ? ogTitle[1] : 'MISSING');

    // Structured Data (JSON-LD)
    const jsonLdMatches = body.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
    console.log('\nJSON-LD Schemas:', jsonLdMatches.length);
    jsonLdMatches.forEach((script, idx) => {
      try {
        const raw = script.replace(/<[^>]+>/g, '');
        const parsed = JSON.parse(raw);
        console.log(`  Schema [${idx+1}] @type:`, parsed['@type'] || (parsed['@graph'] ? parsed['@graph'].map(g => g['@type']).join(', ') : 'unknown'));
      } catch (e) {
        console.log(`  Schema [${idx+1}] parse error`);
      }
    });

    // Content length & Keywords
    const textContent = body.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                            .replace(/<[^>]+>/g, ' ')
                            .replace(/\s+/g, ' ');
    const wordCount = textContent.trim().split(/\s+/).length;
    console.log('\nVisible Text Word Count:', wordCount);

    const keywords = ['prime video login', 'amazon prime', 'sign in', 'stream', 'password', 'help', 'devices'];
    console.log('\nTarget Keyword Frequencies:');
    keywords.forEach(kw => {
      const regex = new RegExp(kw, 'gi');
      const count = (textContent.match(regex) || []).length;
      console.log(`  "${kw}": ${count}`);
    });
  });
});
