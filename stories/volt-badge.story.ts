import { defineStory } from './_types';

export default defineStory({
    component: 'VoltBadge',
    group: 'Components',
    title: 'Badge',
    description: 'Small numeric or status indicator, typically overlaid on an icon or button.',
    variants: [
        {
            name: 'default',
            props: {
                value: '2'
            }
        },
        {
            name: 'success',
            props: {
                value: 'Live',
                severity: 'success'
            }
        },
        {
            name: 'warn',
            props: {
                value: '3',
                severity: 'warn'
            }
        },
        {
            name: 'danger',
            props: {
                value: 'Err',
                severity: 'danger'
            }
        },
        {
            name: 'info',
            props: {
                value: 'New',
                severity: 'info'
            }
        }
    ],
    snippet: '<VoltBadge value="3" severity="danger" />',
    sourcePath: 'components/volt/Badge.vue'
});
