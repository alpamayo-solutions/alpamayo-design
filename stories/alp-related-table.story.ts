import { defineStory } from './_types';

export default defineStory({
    component: 'AlpRelatedTable',
    group: 'Components',
    title: 'Related Table',
    description: 'Compact data table for related-record lists, with an empty state.',
    variants: [
        {
            name: 'default',
            props: {
                items: [
                    { id: '1', name: 'edge-node-01', status: 'Online' },
                    { id: '2', name: 'edge-node-02', status: 'Offline' }
                ]
            },
            slots: {
                default:
                    '<Column field="name" header="Name" /><Column field="status" header="Status" />'
            }
        },
        {
            name: 'empty',
            props: { items: [] }
        }
    ],
    snippet:
        '<AlpRelatedTable :items="devices" :row-to="(row) => `/fleet/${row.id}`">\n  <Column field="name" header="Name" />\n</AlpRelatedTable>',
    sourcePath: 'components/alp/AlpRelatedTable.vue'
});
