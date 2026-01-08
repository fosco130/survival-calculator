import { test, expect } from '@playwright/test';

test('Production site - Full viral transformation validation', async ({ page }) => {
  console.log('\n🚀 VALIDATING PRODUCTION SITE - Viral Transformation\n');

  // Navigate to production
  const url = 'https://loquacious-heliotrope-263b7c.netlify.app/';
  await page.goto(url, { waitUntil: 'networkidle' });

  // Wait for React to render
  await page.waitForTimeout(2000);

  // ====== PHASE 1: Typography & Header ======
  console.log('\n📝 PHASE 1: Typography & Header');
  const header = await page.locator('h1.header-title').textContent();
  console.log(`Header: "${header}"`);
  expect(header).toBe('WHO\'S GETTING RELEGATED?');
  console.log('✅ Header transformation complete');

  // ====== PHASE 2: Core Display ======
  console.log('\n💎 PHASE 2: Survival Display');
  const teamName = await page.locator('.team-name').first().textContent();
  console.log(`Team: ${teamName}`);
  expect(teamName).toBeTruthy();

  const percentage = await page.locator('.percentage-number').first().textContent();
  console.log(`Survival %: ${percentage}`);
  expect(percentage).toMatch(/\d+%/);

  const reaction = await page.locator('.reaction-primary').first().textContent();
  console.log(`Reaction: "${reaction}"`);
  expect(reaction).toBeTruthy();

  // ====== PHASE 3: Calculating State ======
  console.log('\n⚡ PHASE 3: Calculating State with Particles');

  // Select a different team to trigger calculation
  const buttons = await page.locator('button.team-badge-btn').all();
  if (buttons.length > 1) {
    await buttons[1].click();
    await page.waitForTimeout(500);
  }

  // Wait for calculating overlay
  const overlay = await page.locator('.calculating-overlay').count();
  if (overlay > 0) {
    console.log('✅ Calculating overlay appeared');

    // Check for particles
    const particles = await page.locator('.particle').count();
    console.log(`✅ Particles rendered: ${particles}`);
    expect(particles).toBeGreaterThan(0);

    // Check for progress counter
    const progressText = await page.locator('.progress-counter').textContent();
    console.log(`Progress: ${progressText}`);
    expect(progressText).toMatch(/\d+\/10,000/);

    // Check for banter message
    const message = await page.locator('.message-text').textContent();
    console.log(`Banter: "${message}"`);
    expect(message).toBeTruthy();

    // Wait for calculation to complete
    await page.waitForTimeout(8000);
    const overlayAfter = await page.locator('.calculating-overlay').count();
    console.log(`✅ Calculating overlay cleared: ${overlayAfter === 0}`);
  }

  // ====== PHASE 2: Death Zone (Relegation Table) ======
  console.log('\n🔴 PHASE 2: Death Zone Styling');
  const deathZoneTitle = await page.locator('.rivals-title').textContent();
  console.log(`Title: "${deathZoneTitle}"`);
  expect(deathZoneTitle).toContain('DEATH ZONE');

  const relegationZoneTeams = await page.locator('.rival-row.relegation-zone').count();
  console.log(`Relegation zone teams (18-20): ${relegationZoneTeams}`);
  expect(relegationZoneTeams).toBeGreaterThan(0);

  // ====== Share & Banter ======
  console.log('\n💬 PHASE 2: Share Buttons & Banter');
  const shareTitle = await page.locator('.share-title').textContent();
  console.log(`Share title: "${shareTitle}"`);
  expect(shareTitle).toContain('RATIO YOUR RIVALS');

  // ====== Methodology Modal ======
  console.log('\n📋 PHASE 2: Methodology Modal');
  const methodologyBtn = await page.locator('.methodology-button');
  await methodologyBtn.click();
  await page.waitForTimeout(500);

  const modal = await page.locator('.methodology-modal').count();
  console.log(`Modal opened: ${modal > 0 ? '✅' : '❌'}`);

  // ====== Screenshot ======
  console.log('\n📸 Taking production screenshot');
  await page.screenshot({ path: 'tests/screenshots/production-validation.png', fullPage: true });

  console.log('\n✅ VIRAL TRANSFORMATION COMPLETE!\n');
});
