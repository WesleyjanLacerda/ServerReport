import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/painel/',
    plugins: [react()],
    server: {
      port: Number(env.VITE_PORT || 15140),
      proxy: {
        '/api': {
          target: 'http://localhost:15099',
          changeOrigin: true
        }
      }
    }
  };
});
