import { defineStory } from './_types';

export default defineStory({
    component: 'AlpCard',
    group: 'Signature',
    title: 'Card',
    description: 'App-level content card with optional title/count/sub header and collapsible body.',
    variants: [
        {
            name: 'default',
            props: {
                title: 'Devices',
                count: 12,
                sub: '3 orgs'
            },
            slots: {
                default: '<p class="text-sm text-surface-600">edge-node-07 is online.</p>'
            }
        },
        {
            name: 'collapsible',
            props: {
                title: 'Rollout log',
                collapsible: true,
                defaultOpen: false
            },
            slots: {
                default:
                    '<p class="text-sm text-surface-600">Collapsed by default — click the header to expand.</p>'
            }
        }
    ],
    snippet:
        '<AlpCard title="Devices" :count="12" sub="3 orgs">\n  <p>edge-node-07 is online.</p>\n</AlpCard>',
    sourcePath: 'components/alp/AlpCard.vue'
});
