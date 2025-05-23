/* vite.config.js – DEV-proxy только когда нужен реальный бекенд
     (если переменная окружения REAL_API=true) */
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';

export default defineConfig(({ mode }) => ({
  root: 'src',
  publicDir: '../public',
  build: { outDir: '../dist', emptyOutDir: true },
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: {
    port: 5174,
    open: '/login',
    /* proxy включаем только если реально нужен удалённый API */
    proxy: process.env.REAL_API
      ? {
          '/api': {
            target: process.env.VITE_API_URL ?? 'http://localhost:8080',
            changeOrigin: true
          }
        }
      : undefined
  }
}));
