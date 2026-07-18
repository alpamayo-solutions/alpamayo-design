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
    },
    nitro: {
        prerender: {
            // Story variants demonstrate real component props with illustrative hrefs
            // (e.g. AlpDetailActions' `editHref="/projects/edge-node-04"`, AlpAppShell's
            // nav `to: '/settings'`) that describe routes a *consuming app* would have —
            // not routes that exist in this playground. Nitro's default crawler still
            // walks every rendered `<a href>`/NuxtLink it finds, including these, and
            // 404s attempting to prerender them. Failing the whole `generate` over
            // inherently-fictitious demo hrefs would make it impossible to show a
            // realistic prop example in any story. Log + continue instead of aborting;
            // the actual `/story/<id>` pages this repo cares about (design-sync/build.mjs
            // reads them directly off disk) still render and write out successfully.
            failOnError: false
        }
    }
});
