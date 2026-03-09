import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/painel/',
    plugins: [react()],
    server: {
      host: env.VITE_HOST || '0.0.0.0',
      allowedHosts: [env.VITE_ALLOWED_HOST || 'herasis.ddns.net'],
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
