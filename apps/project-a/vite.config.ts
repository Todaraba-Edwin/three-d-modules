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
          src: path.resolve(
            __dirname,
            '../../packages/shared/public/model/**/*'
          ),
          dest: 'model',
        },
      ],
    }),
  ],
  server: {
    port: 3001,
  },
  resolve: {
    alias: {
      '@_shared': path.resolve(
        __dirname,
        '../../packages/shared/src/features/_shared'
      ),
      '@monorepo/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
});
