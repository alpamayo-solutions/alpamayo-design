import { defineStory } from './_types';

export default defineStory({
    component: 'AlpSparklineChart',
    group: 'Signature',
    title: 'Sparkline Chart',
    description: 'Compact SVG sparkline tile with a title and headline value.',
    variants: [
        {
            name: 'default',
            props: {
                title: 'Throughput',
                value: '1.2k/min',
                path: 'M0,30 L20,25 L40,28 L60,15 L80,20 L100,10 L120,18 L140,8 L160,12',
                gradientId: 'sparkline-throughput'
            }
        }
    ],
    snippet:
        '<AlpSparklineChart title="Throughput" value="1.2k/min" path="M0,30 L20,25 L40,28 L60,15" gradient-id="sparkline-throughput" />',
    sourcePath: 'components/alp/AlpSparklineChart.vue'
});
