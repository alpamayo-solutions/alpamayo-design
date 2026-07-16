import { defineStory } from './_types';

export default defineStory({
    component: 'AlpMetricBar',
    group: 'Signature',
    title: 'Metric Bar',
    description:
        'Labelled percentage bar, block or inline, with optional threshold auto-coloring and no-data state.',
    variants: [
        {
            name: 'block',
            props: {
                value: 72,
                label: 'CPU'
            }
        },
        {
            name: 'inline',
            props: {
                value: 45,
                label: 'RAM',
                variant: 'inline'
            }
        },
        {
            name: 'no-data',
            props: {
                value: null,
                label: 'Disk'
            }
        },
        {
            name: 'auto-color-high',
            props: {
                value: 94,
                label: 'Idle',
                autoColor: true
            }
        }
    ],
    snippet: '<AlpMetricBar :value="72" label="CPU" auto-color />',
    sourcePath: 'components/alp/AlpMetricBar.vue'
});
