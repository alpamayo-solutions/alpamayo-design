import { defineStory } from './_types';

export default defineStory({
    component: 'AlpAlertTypeMetric',
    group: 'Signature',
    title: 'Alert Type Metric',
    description: 'Labelled count-of-total metric row for an alert category, with a colored dot and bar.',
    variants: [
        {
            name: 'high',
            props: {
                label: 'Connectivity',
                count: 14,
                total: 20,
                dot: 'bg-danger-500',
                bar: 'bg-danger-500'
            }
        },
        {
            name: 'low',
            props: {
                label: 'Firmware',
                count: 2,
                total: 20,
                dot: 'bg-info-400',
                bar: 'bg-info-400'
            }
        }
    ],
    snippet:
        '<AlpAlertTypeMetric label="Connectivity" :count="14" :total="20" dot="bg-danger-500" bar="bg-danger-500" />',
    sourcePath: 'components/alp/AlpAlertTypeMetric.vue'
});
