import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import cesium from 'vite-plugin-cesium';

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
      '@monorepo/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
  server: {
    port: 3002,
  },
});
