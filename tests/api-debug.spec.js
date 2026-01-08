import { test, expect } from '@playwright/test';

test('API endpoint test - Check /api/get-standings', async ({ page }) => {
  console.log('\n🔍 Testing API endpoint /api/get-standings\n');

  // Try to fetch directly from localhost
  const response = await page.evaluate(() => {
    return fetch('http://localhost:5175/api/get-standings')
      .then(r => ({ status: r.status, ok: r.ok, text: r.text() }))
      .then(r => ({ ...r, text: r.text() }))
      .catch(e => ({ error: e.message }));
  });

  console.log('Response:', response);

  // Now try from deployed site
  const productionResponse = await page.evaluate(() => {
    return fetch('https://loquacious-heliotrope-263b7c.netlify.app/api/get-standings')
      .then(r => ({ status: r.status, ok: r.ok }))
      .catch(e => ({ error: e.message }));
  });

  console.log('Production Response:', productionResponse);
});
