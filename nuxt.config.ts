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
});
