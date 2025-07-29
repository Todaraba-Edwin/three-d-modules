import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import cesium from 'vite-plugin-cesium';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cesium(),
    viteStaticCopy({
      targets: [
        {
          src: path.resolve(__dirname, '../../packages/shared/public/model/*'),
          dest: 'model',
        },
        {
          src: path.resolve(__dirname, '../../packages/shared/public/imgs/*'),
          dest: 'imgs',
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@pages': path.resolve(__dirname, './src/01_pages'),
      '@': path.resolve(__dirname, './src'), // @/01_pages
      '@_shared': path.resolve(
        __dirname,
        '../../packages/shared/src/features/_shared'
      ),
      '@monorepo/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
  server: {
    port: 3002,
  },
});
