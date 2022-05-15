import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.spec.{ts,tsx}'],
    watch: false,
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: ['**/*.spec.{ts,tsx}']
    }
  },
});