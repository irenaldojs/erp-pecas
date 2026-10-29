import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins:
  [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Auto ERP',
        short_name: 'Auto ERP',
        description: 'Auto ERP application',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/vite.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
        display: 'standalone',
      },
    }),
    react(),
  ],
})
