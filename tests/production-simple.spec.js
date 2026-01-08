import { test } from '@playwright/test';

test('Production site - Simple load test', async ({ page }) => {
  // Force no cache
  await page.context().clearCookies();

  const url = 'https://loquacious-heliotrope-263b7c.netlify.app/?bust=' + Date.now();
  console.log(`Loading: ${url}`);

  const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
  console.log(`Response status: ${response.status()}`);

  const title = await page.title();
  console.log(`Page title: ${title}`);

  // Check if app div exists
  const rootHtml = await page.locator('#root').innerHTML();
  console.log(`Root HTML length: ${rootHtml.length} characters`);

  if (rootHtml.length > 100) {
    console.log('✅ React app rendered');
    console.log(`First 200 chars: ${rootHtml.substring(0, 200)}...`);
  } else {
    console.log('❌ React app NOT rendered');
  }

  await page.screenshot({ path: 'tests/screenshots/production-simple.png' });
});
