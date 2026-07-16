import { defineStory } from './_types';

export default defineStory({
    component: 'VoltMessage',
    group: 'Components',
    title: 'Message',
    description: 'Inline status/alert banner, one per severity.',
    variants: [
        {
            name: 'success',
            props: {
                severity: 'success'
            },
            slots: {
                default: 'Rollout to edge-node-07 completed successfully.'
            }
        },
        {
            name: 'info',
            props: {
                severity: 'info'
            },
            slots: {
                default: 'Scheduled maintenance starts in 1 hour.'
            }
        },
        {
            name: 'warn',
            props: {
                severity: 'warn'
            },
            slots: {
                default: 'Certificate for edge-node-07 expires in 3 days.'
            }
        },
        {
            name: 'error',
            props: {
                severity: 'error'
            },
            slots: {
                default: 'Deployment to edge-node-03 failed.'
            }
        },
        {
            name: 'closable',
            props: {
                severity: 'info',
                closable: true
            },
            slots: {
                default: 'New firmware guidance available.'
            }
        }
    ],
    snippet: '<VoltMessage severity="warn">Certificate for edge-node-07 expires in 3 days.</VoltMessage>',
    sourcePath: 'components/volt/Message.vue'
});
