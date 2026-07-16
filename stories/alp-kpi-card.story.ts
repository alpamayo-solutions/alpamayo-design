import { defineStory } from './_types';

export default defineStory({
    component: 'AlpKpiCard',
    group: 'Signature',
    title: 'KPI Card',
    description: 'Compact labelled metric tile with optional trend indicator.',
    variants: [
        {
            name: 'default',
            props: {
                label: 'Uptime',
                value: '99.2%',
                sub: 'last 30 days'
            }
        },
        {
            name: 'trend-up',
            props: {
                label: 'Throughput',
                value: '1.2k/min',
                sub: '+8% vs last week',
                trendIcon: 'pi pi-arrow-up',
                trendColor: 'text-success-500'
            }
        },
        {
            name: 'trend-down',
            props: {
                label: 'Errors',
                value: '14',
                sub: '-3 vs last week',
                trendIcon: 'pi pi-arrow-down',
                trendColor: 'text-danger-500'
            }
        }
    ],
    snippet: '<AlpKpiCard label="Uptime" value="99.2%" sub="last 30 days" />',
    sourcePath: 'components/alp/AlpKpiCard.vue'
});
