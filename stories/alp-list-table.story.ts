import { defineStory } from './_types';

export default defineStory({
    component: 'AlpListTable',
    group: 'Components',
    title: 'List Table',
    description:
        'Server/lazy paginated DataTable shell — caller owns rows, total count, and paging state; columns are declared via a default-slot Column list; falls back to AlpEmptySection when items is empty.',
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
                ],
                rows: 10,
                totalRecords: 3,
                first: 0
            },
            slots: {
                default: '<Column field="name" header="Device" /><Column field="status" header="Status" />'
            }
        },
        {
            name: 'empty',
            props: {
                items: [],
                rows: 10,
                totalRecords: 0,
                first: 0,
                loading: false
            },
            slots: {
                default: '<Column field="name" header="Device" /><Column field="status" header="Status" />'
            }
        }
    ],
    snippet:
        '<AlpListTable :items="nodes" :rows="rows" :total-records="totalRecords" :first="first" @page="onPage">\n  <Column field="name" header="Device" />\n  <Column field="status" header="Status" />\n</AlpListTable>',
    sourcePath: 'components/alp/AlpListTable.vue'
});
