import { test } from '@playwright/test';

test('Current production status check', async ({ page }) => {
  console.log('\n📊 CHECKING CURRENT PRODUCTION STATUS\n');

  // Clear cache
  await page.context().clearCookies();

  const url = 'https://loquacious-heliotrope-263b7c.netlify.app/?t=' + Date.now();
  const response = await page.goto(url, { waitUntil: 'domcontentloaded' });

  console.log(`HTTP Status: ${response.status()}`);

  // Get page content
  const html = await page.content();
  console.log(`HTML size: ${html.length} bytes`);

  // Check for key elements in HTML
  const hasHeader = html.includes('WHO\'S GETTING RELEGATED');
  const hasApp = html.includes('app-bg');
  const hasReact = html.includes('root');

  console.log(`Has "WHO'S GETTING RELEGATED": ${hasHeader}`);
  console.log(`Has app-bg class: ${hasApp}`);
  console.log(`Has root div: ${hasReact}`);

  // Check root element
  const rootContent = await page.locator('#root').innerHTML();
  console.log(`Root HTML size: ${rootContent.length} bytes`);

  if (rootContent.length < 100) {
    console.log('Root HTML (full):');
    console.log(rootContent);
  } else {
    console.log('Root HTML (first 300 chars):');
    console.log(rootContent.substring(0, 300));
  }

  // Try to find elements
  const headerCount = await page.locator('h1').count();
  const survivalCardCount = await page.locator('.survival-card').count();
  const teamNameCount = await page.locator('.team-name').count();
  const percentageCount = await page.locator('.percentage-number').count();

  console.log(`\nElement counts:`);
  console.log(`h1 elements: ${headerCount}`);
  console.log(`.survival-card: ${survivalCardCount}`);
  console.log(`.team-name: ${teamNameCount}`);
  console.log(`.percentage-number: ${percentageCount}`);

  // Get console messages
  const messages = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      messages.push(`ERROR: ${msg.text()}`);
    }
  });

  await page.waitForTimeout(3000);

  if (messages.length > 0) {
    console.log(`\nConsole errors:`);
    messages.forEach(m => console.log(m));
  } else {
    console.log('\nNo console errors');
  }

  // Take screenshot
  await page.screenshot({ path: 'tests/screenshots/status-check.png' });
  console.log('\nScreenshot saved to tests/screenshots/status-check.png');
});
