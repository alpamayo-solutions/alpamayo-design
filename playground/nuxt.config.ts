import { useNuxt } from '@nuxt/kit';

export default defineNuxtConfig({
    extends: ['..', '../layers/workbench'],
    modules: ['@nuxtjs/i18n'],
    vue: {
        // Story slot content is authored as raw template strings (e.g. `<Column .../>`) and must be
        // compiled at runtime so component tags inside them actually instantiate. See
        // playground/pages/story/[id].vue and playground/plugins/story-components.ts.
        runtimeCompiler: true
    },
    hooks: {
        // Nuxt's pages module registers vue-router's Volar plugin for `<route>` SFC blocks
        // during its own `modules:done`/setup phase. This layer doesn't depend on vue-router
        // directly, so npm hoists it under nuxt's own node_modules, where @vue/language-core
        // can't resolve it from the root and `vue-tsc` prints a MODULE_NOT_FOUND stack on
        // every typecheck. Deregister the plugin instead of taking a direct dependency on
        // vue-router purely to satisfy hoisting. Must run from `modules:done` — a plain
        // `prepare:types` hook here runs before the pages module pushes the entry.
        'modules:done'() {
            useNuxt().hook('prepare:types', ({ tsConfig }) => {
                const vco = tsConfig.vueCompilerOptions;
                if (vco && Array.isArray(vco.plugins)) {
                    vco.plugins = vco.plugins.filter((p) => p !== 'vue-router/volar/sfc-route-blocks');
                }
            });
        }
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
            // not routes that exist in this playground (which only has `/` and
            // `/story/*`). Nitro's default crawler still walks every rendered
            // `<a href>`/NuxtLink it finds, including these, and 404s attempting to
            // prerender them. Rather than disabling `failOnError` globally (which would
            // also hide genuinely broken links), scope out exactly these fictitious demo
            // route families; every other route still fails `generate` as normal.
            ignore: ['/settings', '/projects/', '/fleet/']
        }
    }
});
