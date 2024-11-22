import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['./e2e/*.spec.ts'],
    provide: {
      URL_BASE: 'http://localhost:8787',
    },
  },
});
