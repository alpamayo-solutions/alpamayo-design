import { defineStory } from './_types';

export default defineStory({
    component: 'AlpClientTable',
    group: 'Components',
    title: 'Client Table',
    description:
        'Client-side DataTable shell — caller passes the full item array and an optional DataTableFilterMeta; columns are declared via a default-slot Column list; falls back to AlpEmptySection when items is empty.',
    variants: [
        {
            name: 'populated',
            props: {
                items: [
                    {
                        id: '1',
                        name: 'edge-node-01',
                        status: 'online'
                    },
                    {
                        id: '2',
                        name: 'edge-node-02',
                        status: 'online'
                    },
                    {
                        id: '3',
                        name: 'edge-node-03',
                        status: 'offline'
                    }
                ]
            }
        },
        {
            name: 'empty',
            props: {
                items: [],
                loading: false
            }
        }
    ],
    snippet:
        '<AlpClientTable :items="nodes" v-model:filters="filters">\n  <Column field="name" header="Device" />\n  <Column field="status" header="Status" />\n</AlpClientTable>',
    sourcePath: 'components/alp/AlpClientTable.vue'
});
