// const apiBaseUrl= process.env.API_BASE_URL;
const apiBaseUrl= 'http://localhost:3001/';

export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBaseUrl
    }
  },
  app: {
    head: {
      title: 'Navloe',
      link: [
        { rel: 'icon', type: 'image/png', href: "/images/icons/icon-144.png" }
      ],
    }
  },
  css: ["@/assets/scss/style.scss"],
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/eslint-module",
    "nuxt-icon",
    "@nuxt/image",
    "vue3-carousel-nuxt",
  ],
})
