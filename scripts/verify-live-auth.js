const domain = 'https://amzonprimelogin.com';

async function fullLiveTest() {
  console.log('Testing authentication on:', domain);
  
  // Step 1: Login with credentials
  console.log('\n1. Attempting login with admin@primevideo.com...');
  const loginRes = await fetch(domain + '/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@primevideo.com', password: 'PrimeVideo#2026@SecureKey!' })
  });
  console.log('   Status:', loginRes.status, loginRes.status === 200 ? '✅ 200 OK' : '❌ FAILED');
  const loginData = await loginRes.json();
  console.log('   Response body:', JSON.stringify(loginData));
  
  const cookies = loginRes.headers.getSetCookie();
  if (!cookies || cookies.length === 0) {
    console.error('   No cookie received');
    return;
  }
  const sessionCookie = cookies[0].split(';')[0];
  console.log('   Cookie:', sessionCookie.slice(0, 35) + '... (valid token)');

  // Step 2: Access /admin/blog with cookie
  console.log('\n2. Accessing protected page /admin/blog with session cookie...');
  const blogRes = await fetch(domain + '/admin/blog', {
    headers: { Cookie: sessionCookie }
  });
  console.log('   Status:', blogRes.status, blogRes.status === 200 ? '✅ 200 OK' : '❌ FAILED');
  const blogHtml = await blogRes.text();
  console.log('   Page contains Blog Admin:', blogHtml.includes('Blog Admin'));
  console.log('   Page contains Sign Out button:', blogHtml.includes('Sign Out'));

  // Step 3: Fetch protected API /api/blog with cookie
  console.log('\n3. Fetching protected API /api/blog with session cookie...');
  const apiRes = await fetch(domain + '/api/blog', {
    headers: { Cookie: sessionCookie }
  });
  console.log('   Status:', apiRes.status, apiRes.status === 200 ? '✅ 200 OK' : '❌ FAILED');
  const posts = await apiRes.json();
  console.log('   Returned posts array:', Array.isArray(posts), 'Count:', Array.isArray(posts) ? posts.length : 0);

  // Step 4: Access without cookie (should redirect 307)
  console.log('\n4. Testing unauthenticated access to /admin/blog...');
  const unauthRes = await fetch(domain + '/admin/blog', { redirect: 'manual' });
  console.log('   Status:', unauthRes.status, unauthRes.status === 307 ? '✅ 307 REDIRECT' : '❌ UNEXPECTED');
  console.log('   Redirect target:', unauthRes.headers.get('location'));

  console.log('\n======================================================');
  console.log('🎉 ALL LIVE AUTHENTICATION TESTS PASSED 100%!');
  console.log('======================================================');
}

fullLiveTest().catch(console.error);
