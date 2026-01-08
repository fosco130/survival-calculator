import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
});

// Custom matcher for statistical/range testing
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    return {
      message: () => pass
        ? `expected ${received} not to be within range ${floor} - ${ceiling}`
        : `expected ${received} to be within range ${floor} - ${ceiling}`,
      pass
    };
  }
});
