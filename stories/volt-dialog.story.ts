import { defineStory } from './_types';

export default defineStory({
    component: 'VoltDialog',
    group: 'Components',
    title: 'Dialog',
    description: 'Modal overlay for confirmations or focused forms.',
    variants: [
        {
            name: 'open',
            props: {
                visible: true,
                header: 'Confirm rollout',
                modal: true
            },
            slots: {
                default: '<p class="text-sm">Deploy revision a1b2c3d to edge-node-07?</p>'
            }
        }
    ],
    snippet:
        '<VoltDialog v-model:visible="showDialog" header="Confirm rollout" modal>\n  <p>Deploy revision a1b2c3d to edge-node-07?</p>\n</VoltDialog>',
    sourcePath: 'components/volt/Dialog.vue'
});
