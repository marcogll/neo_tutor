import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'NeoType',
        short_name: 'NeoType',
        description: 'Mecanografía táctil y Neovim',
        theme_color: '#0f0f0f',
        background_color: '#0f0f0f',
        display: 'standalone',
        lang: 'es',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
      },
      devOptions: { enabled: false },
    }),
  ],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['codeserver.tail68d50e.ts.net', '.tail68d50e.ts.net', 'localhost'],
    hmr: { clientPort: 443 },
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['codeserver.tail68d50e.ts.net', '.tail68d50e.ts.net', 'localhost'],
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})
