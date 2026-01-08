import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',

    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/lib/**/*.js', 'src/data/**/*.js'],
      exclude: ['src/lib/mockData.js', 'src/test/**', '**/*.test.js'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80
      }
    },

    include: ['src/**/*.{test,spec}.{js,jsx}'],
    testTimeout: 10000,
    mockReset: true,
    restoreMocks: true,
    clearMocks: true
  }
});
