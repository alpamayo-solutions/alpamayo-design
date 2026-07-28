import { fileURLToPath } from 'node:url';
import { defineNuxtConfig } from 'nuxt/config';

const r = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineNuxtConfig({
    css: [r('./assets/css/workbench.css')],
    components: [
        {
            path: r('./components'),
            prefix: 'AlpWorkbench',
            pathPrefix: false
        }
    ]
});
