import { defineStory } from './_types';

export default defineStory({
    component: 'AlpActivityFeedItem',
    group: 'Signature',
    title: 'Activity Feed Item',
    description: 'Single row in a chronological activity feed — actor, action, target, icon, time.',
    variants: [
        {
            name: 'default',
            props: {
                actor: 'Chris N.',
                action: 'redeployed',
                target: 'edge-node-07',
                icon: 'pi pi-refresh',
                time: '2h ago'
            }
        }
    ],
    snippet:
        '<AlpActivityFeedItem actor="Chris N." action="redeployed" target="edge-node-07" icon="pi pi-refresh" time="2h ago" />',
    sourcePath: 'components/alp/AlpActivityFeedItem.vue'
});
