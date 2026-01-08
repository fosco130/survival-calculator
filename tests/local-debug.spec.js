import { test, expect } from '@playwright/test';

test('Local dev server - Debug React app rendering', async ({ page }) => {
  console.log('\n🔍 Testing LOCAL dev server at http://localhost:5175/\n');

  // Navigate to local dev server
  await page.goto('http://localhost:5175/', { waitUntil: 'networkidle' });

  // Wait a moment for React to mount
  await page.waitForTimeout(2000);

  // Take screenshot
  await page.screenshot({ path: 'tests/screenshots/local-dev-debug.png', fullPage: true });

  // Check if React app is rendering
  const header = await page.locator('header').count();
  const survivalCard = await page.locator('.survival-card').count();
  const percentageNumber = await page.locator('.percentage-number').count();
  const teamName = await page.locator('.team-name').count();
  const progressBar = await page.locator('.progress-bar').count();
  const footer = await page.locator('footer').count();

  console.log('\n📊 Local Dev Results:');
  console.log(`Header found: ${header > 0 ? '✅' : '❌'}`);
  console.log(`Survival card found: ${survivalCard > 0 ? '✅' : '❌'}`);
  console.log(`Percentage number found: ${percentageNumber > 0 ? '✅' : '❌'}`);
  console.log(`Team name found: ${teamName > 0 ? '✅' : '❌'}`);
  console.log(`Progress bar found: ${progressBar > 0 ? '✅' : '❌'}`);
  console.log(`Footer found: ${footer > 0 ? '✅' : '❌'}\n`);

  // Check console errors
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Get page content
  const bodyText = await page.locator('body').textContent();
  console.log('Body text content:', bodyText.substring(0, 200));

  // Check if there are any JavaScript errors
  const errors = await page.evaluate(() => {
    const errors = [];
    window.onerror = (msg, url, lineNo, columnNo, error) => {
      errors.push({ msg, url, lineNo, columnNo, error: error?.toString() });
      return false;
    };
    return errors;
  });

  console.log('\nJavaScript errors:', errors.length > 0 ? errors : 'None detected');
  console.log('Console errors:', consoleErrors.length > 0 ? consoleErrors : 'None detected');
});
