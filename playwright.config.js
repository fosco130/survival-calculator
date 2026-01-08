import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'on', // Always take screenshots
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  // Automatically start dev server if not running
  webServer: {
    command: 'npm run dev',
    port: 5173,
    timeout: 120000,
    reuseExistingServer: true, // Don't restart if already running
  },
});
