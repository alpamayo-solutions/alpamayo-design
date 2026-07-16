import { defineStory } from './_types';

export default defineStory({
    component: 'AlpTimelineItem',
    group: 'Signature',
    title: 'Timeline Item',
    description: 'Deployment/rollout timeline entry — version, status, note, time.',
    variants: [
        {
            name: 'deployed',
            props: {
                version: 'a1b2c3d',
                status: 'Deployed',
                severity: 'success',
                note: 'Rollout to edge-node-07',
                time: '2h ago',
                icon: 'pi pi-check',
                dotBg: 'bg-success-100',
                iconColor: 'text-success-600'
            }
        },
        {
            name: 'failed',
            props: {
                version: '9f8e7d6',
                status: 'Failed',
                severity: 'danger',
                note: 'Rollout to edge-node-03',
                time: '1d ago',
                icon: 'pi pi-times',
                dotBg: 'bg-danger-100',
                iconColor: 'text-danger-600'
            }
        },
        {
            name: 'pending',
            props: {
                version: '1a2b3c4',
                status: 'Pending',
                severity: 'info',
                note: 'Scheduled for edge-node-01',
                time: 'in 2h',
                icon: 'pi pi-clock',
                dotBg: 'bg-info-100',
                iconColor: 'text-info-600'
            }
        }
    ],
    snippet:
        '<AlpTimelineItem version="a1b2c3d" status="Deployed" severity="success" note="Rollout to edge-node-07" time="2h ago" icon="pi pi-check" dot-bg="bg-success-100" icon-color="text-success-600" />',
    sourcePath: 'components/alp/AlpTimelineItem.vue'
});
