import cesium from 'vite-plugin-cesium';
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cesium()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@monorepo/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
});
