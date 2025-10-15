/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import cesium from 'vite-plugin-cesium';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { fileURLToPath } from 'node:url';
const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [
    react(),
    cesium(),
    viteStaticCopy({
      targets: [
        {
          src: path.resolve(__dirname, '../shared/public/model/*'),
          dest: 'model',
        },
        {
          src: path.resolve(__dirname, '../shared/public/imgs/*'),
          dest: 'imgs',
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@_shared': path.resolve(__dirname, '../shared/src/features/_shared'),
      '@monorepo/shared': path.resolve(__dirname, '../shared/src'),
    },
  },
  server: {
    port: 3002,
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
});
