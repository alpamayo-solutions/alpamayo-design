import { defineStory } from './_types';

export default defineStory({
    component: 'AlpEntityRow',
    group: 'Signature',
    title: 'Entity Row',
    description:
        'Generic clickable row wrapper (renders as NuxtLink when `to` is set) with a left slot and an optional right slot.',
    variants: [
        {
            name: 'default',
            slots: {
                default: '<span class="text-sm font-medium text-surface-800">edge-node-07</span>',
                right: '<span class="text-xs text-surface-400">Line 4 retrofit</span>'
            }
        },
        {
            name: 'linked',
            props: {
                to: '/'
            },
            slots: {
                default: '<span class="text-sm font-medium text-surface-800">edge-node-07</span>'
            }
        }
    ],
    snippet:
        '<AlpEntityRow to="/devices/edge-node-07">\n  <span>edge-node-07</span>\n  <template #right><span class="text-xs text-surface-400">Line 4 retrofit</span></template>\n</AlpEntityRow>',
    sourcePath: 'components/alp/AlpEntityRow.vue'
});
