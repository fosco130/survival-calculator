import { test, expect } from '@playwright/test';

test('diagnose survival calculator rendering', async ({ page }) => {
  // Array to capture console messages
  const consoleLogs = [];

  // Listen to console messages
  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });

  // Navigate to app with Leeds team URL parameter
  const url = 'https://loquacious-heliotrope-263b7c.netlify.app/?team=leeds';
  console.log(`📱 Navigating to ${url}...`);
  await page.goto(url);

  // Wait for the percentage number to appear AND be stable (calculating = false)
  console.log('⏳ Waiting for calculation to complete...');
  let foundPercentage = false;
  let attempts = 0;

  while (!foundPercentage && attempts < 30) {
    const percentageExists = await page.locator('.percentage-number').count() > 0;
    const calculatingText = await page.evaluate(() => {
      const logs = [];
      // Check if there are any visible calculating indicators
      return document.querySelector('.calculating-indicator') !== null;
    });

    if (percentageExists && !calculatingText) {
      foundPercentage = true;
      console.log(`✅ Percentage element found and stable!`);
    } else {
      await page.waitForTimeout(500);
      attempts++;
    }
  }

  if (!foundPercentage) {
    console.log('⚠️  Percentage did not stabilize within timeout');
  }

  // Take screenshot of entire page
  console.log('📸 Taking full page screenshot...');
  await page.screenshot({
    path: 'tests/screenshots/full-page.png',
    fullPage: true
  });

  // Check what elements exist
  console.log('\n=== DOM ELEMENT CHECK ===');

  const header = await page.locator('.header').count();
  console.log(`Header found: ${header > 0 ? '✅' : '❌'}`);

  const survivalCard = await page.locator('.survival-card').count();
  console.log(`Survival card found: ${survivalCard > 0 ? '✅' : '❌'}`);

  const percentage = await page.locator('.percentage-number').count();
  console.log(`Percentage number found: ${percentage > 0 ? '✅' : '❌'}`);

  const teamName = await page.locator('.team-name').count();
  console.log(`Team name found: ${teamName > 0 ? '✅' : '❌'}`);

  const progressBar = await page.locator('.progress-container').count();
  console.log(`Progress bar found: ${progressBar > 0 ? '✅' : '❌'}`);

  const footer = await page.locator('.footer').count();
  console.log(`Footer found: ${footer > 0 ? '✅' : '❌'}`);

  // Print all console logs from browser
  console.log('\n=== BROWSER CONSOLE LOGS ===');
  consoleLogs.forEach(log => console.log(log));
  console.log('============================\n');

  // Get React component state (if visible in DOM)
  const mainContent = await page.locator('.main-content').innerHTML();
  console.log('Main content HTML length:', mainContent.length);

  if (mainContent.length < 100) {
    console.log('⚠️  Main content is empty or minimal!');
    console.log('Main content:', mainContent);
  }

  // Check if loading skeleton is visible
  const loadingSkeleton = await page.locator('.loading-skeleton').count();
  console.log(`Loading skeleton visible: ${loadingSkeleton > 0 ? 'YES' : 'NO'}`);

  // Check if error state is visible
  const errorState = await page.locator('.error-state').count();
  console.log(`Error state visible: ${errorState > 0 ? 'YES' : 'NO'}`);

  // Check percentage section HTML
  const percentageSection = await page.locator('.percentage-section').innerHTML();
  console.log('\n=== PERCENTAGE SECTION HTML ===');
  console.log(percentageSection.substring(0, 500)); // First 500 chars
  console.log('===============================\n');

  console.log('\n✅ Test complete! Check tests/screenshots/full-page.png');
});
