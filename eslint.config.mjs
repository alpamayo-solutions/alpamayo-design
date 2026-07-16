import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        ignores: [
            'node_modules/',
            '.nuxt/',
            '.output/',
            'design-sync/dist/',
            'playground/.nuxt/',
            'playground/.output/',
            'playground/dist/',
            '**/*.vue',
            '**/*.ts',
            // vendored PrimeVue pass-through presets follow upstream conventions (unused ctx params)
            'presets/**'
        ]
    },
    {
        // Standalone Node CLI scripts (build/check tooling), not bundled by Nuxt/Vite.
        files: ['scripts/**/*.mjs', 'design-sync/**/*.mjs', 'eslint.config.mjs'],
        languageOptions: {
            globals: globals.node
        }
    }
];
