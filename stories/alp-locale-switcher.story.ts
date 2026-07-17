import { defineStory } from './_types';

export default defineStory({
    component: 'AlpLocaleSwitcher',
    group: 'Components',
    title: 'Locale Switcher',
    description: 'Flag + code dropdown button that switches the active vue-i18n locale.',
    variants: [{ name: 'default', props: {} }],
    snippet: '<AlpLocaleSwitcher />',
    sourcePath: 'components/alp/AlpLocaleSwitcher.vue'
});
