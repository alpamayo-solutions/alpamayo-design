import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    test: { environment: 'happy-dom' },
    resolve: {
        alias: {
            '~': fileURLToPath(new URL('.', import.meta.url)),
            '@': fileURLToPath(new URL('.', import.meta.url)),
            // Nuxt's `#components` virtual module doesn't exist under vitest; alias it to a
            // stub that provides a real `NuxtLink` component (renders `<a href>`). This lets
            // components import the component reference (not the unresolved string 'NuxtLink')
            // and lets tests assert link branches produce a genuine anchor.
            '#components': fileURLToPath(new URL('./tests/stubs/nuxt-components.ts', import.meta.url))
        }
    }
});
