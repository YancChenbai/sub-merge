import process from 'node:process'
import { fileURLToPath } from 'node:url'
import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: {
    enabled: true,
  },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@pinia/colada-nuxt',
  ],
  css: [
    '~/assets/css/main.css',
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  sourcemap: false,
  nitro: {
    compressPublicAssets: false,
    preset: process.env.NITRO_PRESET || 'Bun',
  },
  imports: {
    dirs: [
      './server/utils',
    ],
  },
  ui: {
    fonts: false,
  },
  alias: {
    '#server': fileURLToPath(new URL('./server', import.meta.url)),
  },
})
