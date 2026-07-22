import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  host: true,
  allowedHosts: true,
  proxy: {
      '/functions/v1': {
        target: 'https://0ec90b57d6e95fcbda19832f.supabase.co',
        changeOrigin: true,
      },
    },
  },
})
