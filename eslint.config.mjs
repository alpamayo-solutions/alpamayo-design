import js from '@eslint/js';

export default [
    js.configs.recommended,
    {
        ignores: [
            'node_modules/',
            '.nuxt/',
            '.output/',
            'design-sync/dist/',
            'playground/.nuxt/',
            '**/*.vue',
            '**/*.ts',
            // vendored PrimeVue pass-through presets follow upstream conventions (unused ctx params)
            'presets/**'
        ]
    }
];
