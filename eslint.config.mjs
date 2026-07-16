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
            '**/*.ts'
        ]
    }
];
