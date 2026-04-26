import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/twse': {
        target: 'https://www.twse.com.tw',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/twse/, ''),
        headers: {
          Referer: 'https://www.twse.com.tw/',
        },
      },
    },
  },
});
