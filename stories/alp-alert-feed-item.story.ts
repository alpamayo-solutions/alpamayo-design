import { defineStory } from './_types';

export default defineStory({
    component: 'AlpAlertFeedItem',
    group: 'Signature',
    title: 'Alert Feed Item',
    description: 'Single row in an alert feed — message, node/org context, severity, time.',
    variants: [
        {
            name: 'danger',
            props: {
                message: 'Sensor offline for 15 minutes',
                node: 'edge-node-07',
                org: 'Line 4 retrofit',
                severity: 'danger',
                severityLabel: 'Critical',
                time: '5m ago'
            }
        },
        {
            name: 'warning',
            props: {
                message: 'Certificate expires in 3 days',
                node: 'edge-node-03',
                org: 'Line 4 retrofit',
                severity: 'warning',
                severityLabel: 'Warning',
                time: '1h ago'
            }
        },
        {
            name: 'success',
            props: {
                message: 'Connectivity restored',
                node: 'edge-node-01',
                org: 'Line 4 retrofit',
                severity: 'success',
                severityLabel: 'Resolved',
                time: '3h ago'
            }
        },
        {
            name: 'info',
            props: {
                message: 'Scheduled maintenance window starting',
                node: 'edge-node-02',
                org: 'Line 4 retrofit',
                severity: 'info',
                severityLabel: 'Info',
                time: '1d ago'
            }
        },
        {
            name: 'help',
            props: {
                message: 'New firmware guidance available',
                node: 'edge-node-04',
                org: 'Line 4 retrofit',
                severity: 'help',
                severityLabel: 'Advisory',
                time: '2d ago'
            }
        },
        {
            name: 'neutral',
            props: {
                message: 'Node decommissioned',
                node: 'edge-node-09',
                org: 'Line 4 retrofit',
                severity: 'neutral',
                severityLabel: 'Archived',
                time: '1w ago'
            }
        }
    ],
    snippet:
        '<AlpAlertFeedItem message="Sensor offline for 15 minutes" node="edge-node-07" org="Line 4 retrofit" severity="danger" severity-label="Critical" time="5m ago" />',
    sourcePath: 'components/alp/AlpAlertFeedItem.vue'
});
