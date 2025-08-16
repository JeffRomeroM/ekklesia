import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Ekklesia',
        short_name: 'Ekklesia',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        icons: [
          {
            src: 'Ekkelsia.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'Ekkelsia.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
