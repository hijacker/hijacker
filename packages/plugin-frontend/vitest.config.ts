import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.spec.{ts,tsx}'],
    watch: false,
    coverage: {
      all: true,
      provider: 'istanbul',
      reporter: ['text', 'lcov'],
      exclude: ['**/*.spec.{ts,tsx}', '.eslintrc.cjs', 'src/frontend/**/*']
    }
  },
});