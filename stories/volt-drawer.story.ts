import { defineStory } from './_types';

export default defineStory({
    component: 'VoltDrawer',
    group: 'Components',
    title: 'Drawer',
    description: 'Slide-in panel for contextual detail, typically anchored right.',
    variants: [
        {
            name: 'open',
            props: {
                visible: true,
                header: 'Node details',
                position: 'right'
            },
            slots: {
                default: '<p class="text-sm">edge-node-07 — Line 4 retrofit</p>'
            }
        }
    ],
    snippet:
        '<VoltDrawer v-model:visible="showDrawer" header="Node details" position="right">\n  <p>edge-node-07 — Line 4 retrofit</p>\n</VoltDrawer>',
    sourcePath: 'components/volt/Drawer.vue'
});
