import { defineStory } from './_types';

export default defineStory({
    component: 'AlpConnectorHealthRow',
    group: 'Signature',
    title: 'Connector Health Row',
    description: 'Protocol connector row — endpoint, tag count, latency, status text.',
    variants: [
        {
            name: 'default',
            props: {
                protocol: 'OPC UA',
                endpoint: 'opc.tcp://edge-node-07:4840',
                tags: 128,
                latency: '12ms',
                status: 'Healthy'
            }
        }
    ],
    snippet:
        '<AlpConnectorHealthRow protocol="OPC UA" endpoint="opc.tcp://edge-node-07:4840" :tags="128" latency="12ms" status="Healthy" />',
    sourcePath: 'components/alp/AlpConnectorHealthRow.vue'
});
