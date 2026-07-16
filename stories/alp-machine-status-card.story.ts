import { defineStory } from './_types';

export default defineStory({
    component: 'AlpMachineStatusCard',
    group: 'Signature',
    title: 'Machine Status Card',
    description: 'Machine summary card — online/degraded state, node/sensor/alert counts.',
    variants: [
        {
            name: 'online',
            props: {
                name: 'CNC Mill 3',
                org: 'Line 4 retrofit',
                online: true,
                degraded: false,
                nodes: 2,
                sensors: 14,
                alerts: 0,
                lastSeen: 'just now'
            }
        },
        {
            name: 'degraded',
            props: {
                name: 'CNC Mill 3',
                org: 'Line 4 retrofit',
                online: true,
                degraded: true,
                nodes: 2,
                sensors: 14,
                alerts: 2,
                lastSeen: '2m ago'
            }
        },
        {
            name: 'offline',
            props: {
                name: 'CNC Mill 3',
                org: 'Line 4 retrofit',
                online: false,
                degraded: false,
                nodes: 2,
                sensors: 14,
                alerts: 5,
                lastSeen: '3h ago'
            }
        }
    ],
    snippet:
        '<AlpMachineStatusCard name="CNC Mill 3" org="Line 4 retrofit" :online="true" :degraded="false" :nodes="2" :sensors="14" :alerts="0" last-seen="just now" />',
    sourcePath: 'components/alp/AlpMachineStatusCard.vue'
});
