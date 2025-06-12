import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath, URL } from 'url';

export default defineConfig(({ mode }) => {
  // загружаем .env[.local] + переменные shell
  const env = loadEnv(mode, process.cwd(), '');

  return {
    root: 'src',
    publicDir: '../public',
    build: { outDir: '../dist', emptyOutDir: true },
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    server: {
      port: 5174,
      open: '/login',
      proxy: env.REAL_API
        ? { '/api': { target: env.VITE_API_URL, changeOrigin: true } }
        : undefined
    }
  };
});
