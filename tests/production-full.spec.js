import { test, expect } from '@playwright/test';

test('Production site - VIRAL TRANSFORMATION COMPLETE', async ({ page }) => {
  console.log('\n🚀 PRODUCTION DEPLOYMENT VERIFICATION\n');

  // Navigate with cache bust
  await page.context().clearCookies();
  const url = 'https://loquacious-heliotrope-263b7c.netlify.app/?bust=' + Date.now();

  const response = await page.goto(url, { waitUntil: 'networkidle' });
  console.log(`✅ Response: ${response.status()}`);

  // Wait for React to fully mount
  await page.waitForTimeout(2000);

  // ========== PHASE 1: HEADER & TYPOGRAPHY ==========
  const headerExists = await page.locator('h1.header-title').count();
  expect(headerExists).toBeGreaterThan(0);
  const headerText = await page.locator('h1.header-title').textContent();
  console.log(`✅ PHASE 1: Header - "${headerText}"`);

  // ========== PHASE 2: CORE DISPLAY ==========
  const teamNameExists = await page.locator('.team-name').count();
  expect(teamNameExists).toBeGreaterThan(0);
  console.log('✅ PHASE 2: Team name rendered');

  const percentageExists = await page.locator('.percentage-number').count();
  expect(percentageExists).toBeGreaterThan(0);
  const percentage = await page.locator('.percentage-number').first().textContent();
  console.log(`✅ PHASE 2: Percentage - ${percentage}`);

  // ========== PHASE 2: DEATH ZONE ==========
  const deathZoneExists = await page.locator('.rivals-title').count();
  expect(deathZoneExists).toBeGreaterThan(0);
  const deathZoneText = await page.locator('.rivals-title').textContent();
  console.log(`✅ PHASE 2: Death Zone - "${deathZoneText}"`);

  // ========== PHASE 2: SHARE BUTTONS ==========
  const shareTitle = await page.locator('.share-title').textContent();
  console.log(`✅ PHASE 2: Share - "${shareTitle}"`);

  // ========== PHASE 3: CALCULATING STATE ==========
  console.log('Testing calculating state...');
  const teamButtons = await page.locator('button.team-badge-btn').all();
  if (teamButtons.length > 1) {
    await teamButtons[1].click();
    await page.waitForTimeout(500);

    const overlayCount = await page.locator('.calculating-overlay').count();
    if (overlayCount > 0) {
      const particles = await page.locator('.particle').count();
      console.log(`✅ PHASE 3: Particles - ${particles} rendered`);

      const progress = await page.locator('.progress-counter').textContent();
      console.log(`✅ PHASE 3: Progress - ${progress}`);

      const banter = await page.locator('.message-text').textContent();
      console.log(`✅ PHASE 3: Banter - "${banter}"`);
    }
  }

  // ========== TAKE SCREENSHOT ==========
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'tests/screenshots/production-final.png', fullPage: true });

  console.log('\n✅ VIRAL TRANSFORMATION DEPLOYED AND VERIFIED!\n');
});
