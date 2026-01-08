import { test } from '@playwright/test';

test('Detailed production diagnostics', async ({ page }) => {
  console.log('\n🔍 DETAILED PRODUCTION DIAGNOSTICS\n');

  // Capture all network requests
  const requests = [];
  page.on('request', req => {
    requests.push({
      url: req.url(),
      method: req.method(),
      time: new Date().toISOString()
    });
  });

  // Capture console messages
  const logs = [];
  page.on('console', msg => {
    logs.push(`[${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  // Capture page errors
  page.on('pageerror', err => {
    logs.push(`[ERROR] ${err.toString()}`);
  });

  await page.context().clearCookies();
  const url = 'https://loquacious-heliotrope-263b7c.netlify.app/?t=' + Date.now();

  const response = await page.goto(url, { waitUntil: 'networkidle' });
  console.log(`HTTP: ${response.status()}`);

  // Wait for React and API calls
  await page.waitForTimeout(3000);

  // Get the full rendered content
  const html = await page.content();
  console.log(`Total HTML: ${html.length} bytes`);

  // Check key indicators
  const rootHtml = await page.locator('#root').innerHTML();
  console.log(`Root element: ${rootHtml.length} bytes`);

  // Check for survival-card in HTML
  const hasSurvivalCard = html.includes('survival-card');
  console.log(`HTML contains .survival-card: ${hasSurvivalCard}`);

  // Check for error messages in rendered content
  const hasErrorState = html.includes('ErrorState') || html.includes('Something Went Wrong');
  console.log(`HTML contains error indicators: ${hasErrorState}`);

  // Check for loading skeleton
  const hasLoadingSkeleton = html.includes('LoadingSkeleton') || html.includes('percentage-skeleton');
  console.log(`HTML contains loading skeleton: ${hasLoadingSkeleton}`);

  // List API calls
  console.log(`\n📡 API Requests (${requests.length}):`);
  const apiRequests = requests.filter(r => r.url.includes('api') || r.url.includes('football-data'));
  if (apiRequests.length > 0) {
    apiRequests.forEach(r => console.log(`  ${r.method} ${r.url}`));
  } else {
    console.log('  (None detected)');
  }

  // List console messages
  console.log(`\n💬 Console Messages (${logs.length}):`);
  logs.slice(0, 10).forEach(log => console.log(`  ${log}`));
  if (logs.length > 10) {
    console.log(`  ... and ${logs.length - 10} more`);
  }

  // Try to access React DevTools to check state
  const reactState = await page.evaluate(() => {
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      return 'React DevTools available';
    }
    return 'React DevTools not available';
  });
  console.log(`\nReact status: ${reactState}`);

  // Check specific elements
  const elements = {
    'h1.header-title': await page.locator('h1.header-title').count(),
    '.team-selector': await page.locator('.team-selector').count(),
    '.survival-card': await page.locator('.survival-card').count(),
    '.percentage-number': await page.locator('.percentage-number').count(),
    '.error': await page.locator('[class*="error"]').count(),
    '[class*="skeleton"]': await page.locator('[class*="skeleton"]').count(),
  };

  console.log(`\n📦 Element Counts:`);
  Object.entries(elements).forEach(([sel, count]) => {
    console.log(`  ${sel}: ${count}`);
  });

  // Get text content to see what's actually displayed
  const bodyText = await page.locator('body').textContent();
  const textSnippet = bodyText.substring(0, 300);
  console.log(`\n📄 Body text (first 300 chars):`);
  console.log(`  "${textSnippet}..."`);

  // Screenshot
  await page.screenshot({ path: 'tests/screenshots/detailed-status.png', fullPage: true });
});
