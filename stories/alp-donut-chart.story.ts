import { defineStory } from './_types';

export default defineStory({
    component: 'AlpDonutChart',
    group: 'Signature',
    title: 'Donut Chart',
    description: 'Static donut summary tile with a legend list.',
    variants: [
        {
            name: 'default',
            props: {
                title: 'Device status',
                value: '21',
                items: [
                    {
                        label: 'Online',
                        count: 18,
                        color: 'success',
                        dotClass: 'bg-success-500'
                    },
                    {
                        label: 'Offline',
                        count: 3,
                        color: 'danger',
                        dotClass: 'bg-danger-500'
                    }
                ]
            }
        }
    ],
    snippet: '<AlpDonutChart title="Device status" value="21" :items="statusItems" />',
    sourcePath: 'components/alp/AlpDonutChart.vue'
});
