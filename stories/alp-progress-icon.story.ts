import { defineStory } from './_types';

export default defineStory({
    component: 'AlpProgressIcon',
    group: 'Components',
    title: 'Progress Icon',
    description:
        'Tiny status marker: a fill-fraction progress ring for `progress-<0-100>` keys, a curated PrimeIcon for `pi-*` keys, or an outlined dot fallback.',
    variants: [
        {
            name: 'progress-25',
            props: { icon: 'progress-25', color: '#3b82f6' }
        },
        {
            name: 'progress-75',
            props: { icon: 'progress-75', color: '#f59e0b' }
        },
        {
            name: 'prime-icon',
            props: { icon: 'pi-check-circle', color: '#22c55e' }
        },
        {
            name: 'fallback-dot',
            props: { icon: null, color: '#94a3b8' }
        }
    ],
    snippet: '<AlpProgressIcon icon="progress-75" color="#f59e0b" />',
    sourcePath: 'components/alp/AlpProgressIcon.vue'
});
