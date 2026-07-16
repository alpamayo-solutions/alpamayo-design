import { fileURLToPath } from 'node:url';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineNuxtConfig({
    components: [
        { path: r('./components/volt'), prefix: 'Volt', pathPrefix: false },
        { path: r('./components/alp'), pathPrefix: false }
    ],
    css: [r('./assets/css/tokens.css')],
    plugins: [r('./plugins/primevue.ts')]
});
