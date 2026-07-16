import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    test: { environment: 'happy-dom' },
    resolve: {
        alias: {
            '~': fileURLToPath(new URL('.', import.meta.url)),
            '@': fileURLToPath(new URL('.', import.meta.url))
        }
    }
});
