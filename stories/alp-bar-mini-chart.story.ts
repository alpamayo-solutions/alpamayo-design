import { defineStory } from './_types';

export default defineStory({
    component: 'AlpBarMiniChart',
    group: 'Signature',
    title: 'Bar Mini Chart',
    description: 'Compact static bar-chart tile with a title and headline value.',
    variants: [
        {
            name: 'default',
            props: {
                title: 'Throughput',
                value: '1.2k msg/min'
            }
        }
    ],
    snippet: '<AlpBarMiniChart title="Throughput" value="1.2k msg/min" />',
    sourcePath: 'components/alp/AlpBarMiniChart.vue'
});
