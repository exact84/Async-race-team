import { defineConfig, mergeConfig, configDefaults } from 'vitest/config';
import viteConfig from './vite.config.mjs';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      setupFiles: './vitest.setup.mjs',
      environment: 'jsdom',
      coverage: {
        include: ['src/**/*.ts'],
        exclude: ['types.ts', 'constants.ts'],
        thresholds: { lines: 70, functions: 70, branches: 70, statements: 70 },
      },
    },
  })
);
