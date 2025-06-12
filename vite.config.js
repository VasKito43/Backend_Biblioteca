// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // direciona /api/* para o seu Express na porta 8086
      '/api': {
        target: 'http://localhost:8086',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
