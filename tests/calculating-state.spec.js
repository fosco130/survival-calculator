import { test, expect } from '@playwright/test';

test('Calculating state with Monte Carlo particles and banter messages', async ({ page }) => {
  console.log('\n🔍 Testing calculating state with particles and banter messages\n');

  // Navigate to local dev server
  await page.goto('http://localhost:5175/', { waitUntil: 'networkidle' });

  // Wait for page to load
  await page.waitForTimeout(2000);

  // Select Arsenal to trigger a calculation (change from default Leeds)
  const arsenalBtn = page.locator('button:has-text("ARS")').first();
  await arsenalBtn.click();

  // Wait for calculation overlay to appear
  await page.waitForSelector('.calculating-overlay', { timeout: 5000 });

  console.log('✅ Calculating overlay appeared');

  // Take screenshot of calculating state
  await page.screenshot({ path: 'tests/screenshots/calculating-state.png', fullPage: true });

  // Check for Monte Carlo animation elements
  const particlesContainer = await page.locator('.particles-container').count();
  const particles = await page.locator('.particle').count();
  const animationLegend = await page.locator('.animation-legend').count();
  const progressCounter = await page.locator('.progress-counter').count();

  console.log(`Particles container found: ${particlesContainer > 0 ? '✅' : '❌'}`);
  console.log(`Particles rendered: ${particles > 0 ? `✅ (${particles} particles)` : '❌'}`);
  console.log(`Animation legend found: ${animationLegend > 0 ? '✅' : '❌'}`);
  console.log(`Progress counter found: ${progressCounter > 0 ? '✅' : '❌'}`);

  // Check for banter messages
  const banterMessage = await page.locator('.message-text').textContent();
  console.log(`Banter message: "${banterMessage}"`);

  // Check for progress update (should show X / 10000)
  const progressText = await page.locator('.progress-counter').textContent();
  console.log(`Progress text: "${progressText}"`);

  // Wait for calculation to complete (should see percentage appear)
  const percentageNumber = await page.locator('.percentage-number').first();
  await page.waitForTimeout(8000); // Wait up to 8 seconds for calculation

  const finalPercentage = await percentageNumber.textContent();
  console.log(`\nFinal survival percentage: ${finalPercentage}`);

  // Verify overlay is gone
  const overlayAfter = await page.locator('.calculating-overlay').count();
  console.log(`Calculating overlay cleared: ${overlayAfter === 0 ? '✅' : '❌'}`);
});
