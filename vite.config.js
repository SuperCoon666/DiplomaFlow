import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  root: 'src',                 // корень исходников
  publicDir: '../public',      // статические файлы
  build: {
    outDir: '../dist',         // куда положить сборку
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    open: '/'
  }
});
