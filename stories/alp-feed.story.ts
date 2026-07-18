import { defineStory } from './_types';

export default defineStory({
    component: 'AlpFeed',
    group: 'Components',
    title: 'Feed',
    description: 'Severity-ranked alert/activity feed row list, with an empty state.',
    variants: [
        {
            name: 'mixed-severity',
            props: {
                items: [
                    {
                        id: '1',
                        severity: 'info',
                        severityLabel: 'Info',
                        title: 'Scheduled maintenance window starting',
                        sub: 'edge-node-02',
                        time: '1d ago'
                    },
                    {
                        id: '2',
                        severity: 'danger',
                        severityLabel: 'Critical',
                        title: 'edge-node-07 offline',
                        sub: 'Line 4 retrofit',
                        time: '5m ago',
                        href: '/fleet/edge-node-07',
                        source: 'headscale',
                        sourceLabel: 'Headscale'
                    },
                    {
                        id: '3',
                        severity: 'success',
                        severityLabel: 'Resolved',
                        title: 'Connectivity restored',
                        sub: 'edge-node-01',
                        time: '3h ago'
                    }
                ],
                emptyMessage: 'No alerts.'
            }
        },
        {
            name: 'empty',
            props: {
                items: [],
                emptyMessage: 'No alerts in the last 24 hours.',
                emptyIcon: 'pi pi-check-circle'
            }
        }
    ],
    snippet: '<AlpFeed :items="alerts" empty-message="No alerts." />',
    sourcePath: 'components/alp/AlpFeed.vue'
});
