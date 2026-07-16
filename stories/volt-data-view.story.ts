import { defineStory } from './_types';

export default defineStory({
    component: 'VoltDataView',
    group: 'Components',
    title: 'DataView',
    description:
        'List/grid data renderer. The real #list template is a scoped slot and cannot be represented through the story slot mechanism — this story mounts with data only.',
    variants: [
        {
            name: 'default',
            props: {
                value: [
                    {
                        name: 'edge-node-01'
                    },
                    {
                        name: 'edge-node-07'
                    }
                ]
            }
        }
    ],
    snippet:
        '<VoltDataView :value="devices">\n  <template #list="{ items }">\n    <div v-for="d in items" :key="d.name">{{ d.name }}</div>\n  </template>\n</VoltDataView>',
    sourcePath: 'components/volt/DataView.vue'
});
