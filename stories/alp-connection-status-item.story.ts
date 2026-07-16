import { defineStory } from './_types';

export default defineStory({
    component: 'AlpConnectionStatusItem',
    group: 'Signature',
    title: 'Connection Status Item',
    description: 'Labelled connection health row with a pulsing status dot.',
    variants: [
        {
            name: 'online',
            props: {
                label: 'MQTT broker',
                sub: 'Connected',
                pulse: true,
                severity: 'success'
            }
        },
        {
            name: 'degraded',
            props: {
                label: 'OPC UA gateway',
                sub: 'Reconnecting',
                pulse: true,
                severity: 'warning'
            }
        },
        {
            name: 'offline',
            props: {
                label: 'Headscale VPN',
                sub: 'Disconnected',
                pulse: false,
                severity: 'danger'
            }
        }
    ],
    snippet:
        '<AlpConnectionStatusItem label="MQTT broker" sub="Connected" :pulse="true" severity="success" />',
    sourcePath: 'components/alp/AlpConnectionStatusItem.vue'
});
