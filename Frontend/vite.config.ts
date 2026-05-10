import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This matches any request starting with /api
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // This removes the '/api' prefix before sending it to the backend
        // So /api/users/login becomes http://localhost:8080/users/login
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
