import tailwindcss from '@tailwindcss/vite';

import './lib/env';

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',

  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@nuxt/fonts',
    '@vee-validate/nuxt',
    'nuxt-csurf',
    'nuxt-maplibre',
    '@nuxtjs/i18n',
  ],

  css: ['~/assets/css/main.css'],

  eslint: {
    config: {
      standalone: false,
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      include: [
        'maplibre-gl',
      ],
    },
  },

  colorMode: {
    dataValue: 'theme',
  },

  fonts: {
    families: [
      {
        name: 'Montserrat',
        provider: 'google',
        weights: [100, 200, 300, 400, 500, 600, 700, 800],
      },
    ],
  },

  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'pl', name: 'Polski', file: 'pl.json' },
    ],
    defaultLocale: 'en',
    langDir: 'locales/',
    strategy: 'no_prefix',
  },
});
