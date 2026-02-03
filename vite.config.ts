import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/espressif-vendor-wizard/',
  server: {
    proxy: {
      // Proxy API requests to Langchao internal server
      '/api/langchao-internal': {
        target: 'http://192.168.6.91:32000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/langchao-internal/, ''),
        secure: false,
      },
      // Proxy API requests to Langchao external server
      '/api/langchao-external': {
        target: 'http://58.33.3.130:32000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/langchao-external/, ''),
        secure: false,
      },
    },
  },
})
