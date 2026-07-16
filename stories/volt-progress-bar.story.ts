import { defineStory } from './_types';

export default defineStory({
    component: 'VoltProgressBar',
    group: 'Components',
    title: 'ProgressBar',
    description: 'Determinate/indeterminate progress indicator.',
    variants: [
        {
            name: 'default',
            props: {
                value: 62
            }
        },
        {
            name: 'low',
            props: {
                value: 12
            }
        },
        {
            name: 'indeterminate',
            props: {
                mode: 'indeterminate'
            }
        }
    ],
    snippet: '<VoltProgressBar :value="62" />',
    sourcePath: 'components/volt/ProgressBar.vue'
});
