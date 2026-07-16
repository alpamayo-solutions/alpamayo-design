export default defineNuxtConfig({
    extends: ['..'],
    modules: ['@nuxtjs/i18n'],
    i18n: {
        defaultLocale: 'en',
        strategy: 'no_prefix',
        locales: [{ code: 'en', language: 'en-US', file: 'en.ts' }],
        langDir: 'locales'
    },
    css: ['~/assets/main.css'],
    postcss: {
        plugins: { '@tailwindcss/postcss': {}, autoprefixer: {} }
    }
});
