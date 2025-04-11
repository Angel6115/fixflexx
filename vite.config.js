import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'FixFlexx',
        short_name: 'FixFlexx',
        description: 'Tu solución de servicios técnicos a domicilio',
        theme_color: '#1e40af',
        icons: [
          {
            src: '/logoFixFlexx.jpg',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/logoFixFlexx.jpg',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
