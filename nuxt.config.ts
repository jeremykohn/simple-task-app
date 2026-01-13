// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  modules: ['@nuxtjs/tailwindcss'],
  
  typescript: {
    strict: true,
    typeCheck: true
  },
  
  app: {
    head: {
      title: 'Task List App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Simple task management application built with Nuxt 4' }
      ]
    }
  }
})
