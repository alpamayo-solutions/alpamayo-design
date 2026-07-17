import { defineStory } from './_types';

export default defineStory({
    component: 'AlpFlagIcon',
    group: 'Components',
    title: 'Flag Icon',
    description: 'Small SVG country flag for a locale code, with a text-label fallback for unknown codes.',
    variants: [
        { name: 'de', props: { code: 'de' } },
        { name: 'de-ch', props: { code: 'de-ch' } },
        { name: 'en', props: { code: 'en' } },
        { name: 'unknown', props: { code: 'fr' } }
    ],
    snippet: '<AlpFlagIcon code="de" class="w-6 h-4" />',
    sourcePath: 'components/alp/AlpFlagIcon.vue'
});
