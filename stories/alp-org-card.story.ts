import { defineStory } from './_types';

export default defineStory({
    component: 'AlpOrgCard',
    group: 'Signature',
    title: 'Org Card',
    description: 'Organization summary card — location, node/machine counts, alerts, status.',
    variants: [
        {
            name: 'default',
            props: {
                name: 'Line 4 Retrofit AG',
                location: 'Lucerne, CH',
                nodes: 3,
                machines: 8,
                alerts: 1,
                status: 'Active'
            }
        }
    ],
    snippet:
        '<AlpOrgCard name="Line 4 Retrofit AG" location="Lucerne, CH" :nodes="3" :machines="8" :alerts="1" status="Active" />',
    sourcePath: 'components/alp/AlpOrgCard.vue'
});
