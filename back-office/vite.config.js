import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // the API's CORS whitelist only allows 5174 for the admin app
  server: { port: 5174, strictPort: true },
})
