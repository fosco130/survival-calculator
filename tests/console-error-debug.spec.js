import { test } from '@playwright/test';

test('Capture console errors from local dev server', async ({ page }) => {
  const errors = [];
  const warnings = [];

  // Capture console messages
  page.on('console', (msg) => {
    console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`);
    if (msg.type() === 'error') errors.push(msg.text());
    if (msg.type() === 'warn') warnings.push(msg.text());
  });

  // Capture uncaught exceptions
  page.on('pageerror', (error) => {
    console.log(`[PAGE ERROR] ${error.toString()}`);
    errors.push(error.toString());
  });

  // Navigate
  await page.goto('http://localhost:5175/', { waitUntil: 'networkidle' });

  // Wait a bit for any JS errors
  await page.waitForTimeout(3000);

  console.log('\n=== ERRORS ===');
  errors.forEach(e => console.log(e));

  console.log('\n=== WARNINGS ===');
  warnings.slice(0, 10).forEach(w => console.log(w));

  // Try to get React error boundary info
  const appContent = await page.evaluate(() => {
    return {
      rootExists: !!document.getElementById('root'),
      rootHTML: document.getElementById('root')?.innerHTML || 'NONE',
      windowReactExists: !!window.__REACT_DEVTOOLS_GLOBAL_HOOK__,
      documentReady: document.readyState,
    };
  });

  console.log('\n=== APP INFO ===');
  console.log(JSON.stringify(appContent, null, 2));
});
