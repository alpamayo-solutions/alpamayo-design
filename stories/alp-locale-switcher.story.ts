import { defineStory } from './_types';

export default defineStory({
    component: 'AlpLocaleSwitcher',
    group: 'Components',
    title: 'Locale Switcher',
    description:
        'Flag + code dropdown button — fully presentational, reports the selected locale via update:modelValue.',
    variants: [
        {
            name: 'default',
            props: {
                locales: [
                    { code: 'en', name: 'English' },
                    { code: 'de', name: 'Deutsch' },
                    { code: 'fr', name: 'Français' }
                ],
                modelValue: 'en'
            }
        }
    ],
    snippet: '<AlpLocaleSwitcher :locales="locales" v-model="activeLocale" />',
    sourcePath: 'components/alp/AlpLocaleSwitcher.vue'
});
