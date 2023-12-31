import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/CS541-DDPoetry/' : '',
  plugins: [react(), tsconfigPaths(), splitVendorChunkPlugin()],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
