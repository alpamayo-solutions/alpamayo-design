import { defineStory } from './_types';

export default defineStory({
    component: 'AlpProgressBar',
    group: 'Signature',
    title: 'Progress Bar',
    description: 'Minimal bare progress bar primitive, used e.g. inside AlpBeltLifeRow and AlpMetricBar.',
    variants: [
        {
            name: 'default',
            props: {
                value: 64
            }
        },
        {
            name: 'danger',
            props: {
                value: 18,
                barColor: 'bg-danger-500'
            }
        },
        {
            name: 'tall',
            props: {
                value: 80,
                height: 'h-3'
            }
        }
    ],
    snippet: '<AlpProgressBar :value="64" />',
    sourcePath: 'components/alp/AlpProgressBar.vue'
});
