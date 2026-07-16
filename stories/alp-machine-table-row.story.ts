import { defineStory } from './_types';

export default defineStory({
    component: 'AlpMachineTableRow',
    group: 'Signature',
    title: 'Machine Table Row',
    description: 'Compact table row for a machine — online dot, name, org, last-seen, pinned revision.',
    variants: [
        {
            name: 'online',
            props: {
                name: 'CNC Mill 3',
                org: 'Line 4 retrofit',
                online: true,
                lastSeen: 'just now',
                revision: 'a1b2c3d'
            }
        },
        {
            name: 'offline',
            props: {
                name: 'CNC Mill 3',
                org: 'Line 4 retrofit',
                online: false,
                lastSeen: '3h ago',
                revision: '9f8e7d6'
            }
        }
    ],
    snippet:
        '<AlpMachineTableRow name="CNC Mill 3" org="Line 4 retrofit" :online="true" last-seen="just now" revision="a1b2c3d" />',
    sourcePath: 'components/alp/AlpMachineTableRow.vue'
});
