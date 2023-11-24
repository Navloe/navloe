// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Navloe',
      link: [
        { rel: 'favicon', type: 'image/png', href: '/navloeLogo.png' }
      ],
    }
  },
  css: ["@/assets/scss/style.scss"],
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/eslint-module",
  ],
})
