import { defineStory } from './_types';

export default defineStory({
    component: 'AlpServiceCard',
    group: 'Signature',
    title: 'Service Card',
    description: 'Edge service summary card — icon, description, status pill, two meta fields.',
    variants: [
        {
            name: 'healthy',
            props: {
                name: 'MQTT Gateway',
                desc: 'Bridges OPC UA to MQTT',
                icon: 'pi pi-server',
                iconBg: 'bg-primary-100',
                iconColor: 'text-primary-600',
                status: 'Running',
                severity: 'success',
                meta1: 'v2.4.1',
                meta2: 'edge-node-07'
            }
        },
        {
            name: 'degraded',
            props: {
                name: 'MQTT Gateway',
                desc: 'Bridges OPC UA to MQTT',
                icon: 'pi pi-server',
                iconBg: 'bg-warning-100',
                iconColor: 'text-warning-600',
                status: 'Degraded',
                severity: 'warning',
                meta1: 'v2.4.1',
                meta2: 'edge-node-07'
            }
        },
        {
            name: 'down',
            props: {
                name: 'MQTT Gateway',
                desc: 'Bridges OPC UA to MQTT',
                icon: 'pi pi-server',
                iconBg: 'bg-danger-100',
                iconColor: 'text-danger-600',
                status: 'Down',
                severity: 'danger',
                meta1: 'v2.4.1',
                meta2: 'edge-node-07'
            }
        }
    ],
    snippet:
        '<AlpServiceCard name="MQTT Gateway" desc="Bridges OPC UA to MQTT" icon="pi pi-server" status="Running" severity="success" meta1="v2.4.1" meta2="edge-node-07" />',
    sourcePath: 'components/alp/AlpServiceCard.vue'
});
