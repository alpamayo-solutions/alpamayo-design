import { defineStory } from './_types';

export default defineStory({
    component: 'VoltDataTable',
    group: 'Components',
    title: 'DataTable',
    description:
        'Data grid with pagination controls. Columns are declared via primevue/column children (not representable through the story slot mechanism) — this story mounts with data only.',
    variants: [
        {
            name: 'default',
            props: {
                value: [
                    {
                        name: 'edge-node-01',
                        status: 'online'
                    },
                    {
                        name: 'edge-node-07',
                        status: 'offline'
                    }
                ]
            }
        }
    ],
    snippet:
        '<VoltDataTable :value="devices">\n  <Column field="name" header="Device" />\n  <Column field="status" header="Status" />\n</VoltDataTable>',
    sourcePath: 'components/volt/DataTable.vue'
});
