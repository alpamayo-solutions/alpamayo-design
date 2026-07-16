import { defineStory } from './_types';

export default defineStory({
    component: 'AlpStatusDot',
    group: 'Signature',
    title: 'Status Dot',
    description: 'Small status indicator dot, one per device status.',
    variants: [
        {
            name: 'online',
            props: {
                status: 'online'
            }
        },
        {
            name: 'offline',
            props: {
                status: 'offline'
            }
        },
        {
            name: 'degraded',
            props: {
                status: 'degraded'
            }
        },
        {
            name: 'maintenance',
            props: {
                status: 'maintenance'
            }
        },
        {
            name: 'unknown',
            props: {
                status: 'unknown'
            }
        }
    ],
    snippet: '<AlpStatusDot status="online" />',
    sourcePath: 'components/alp/AlpStatusDot.vue'
});
