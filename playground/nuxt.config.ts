export default defineNuxtConfig({
    extends: ['..'],
    modules: ['@nuxtjs/i18n'],
    vue: {
        // Story slot content is authored as raw template strings (e.g. `<Column .../>`) and must be
        // compiled at runtime so component tags inside them actually instantiate. See
        // playground/pages/story/[id].vue and playground/plugins/story-components.ts.
        runtimeCompiler: true
    },
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
