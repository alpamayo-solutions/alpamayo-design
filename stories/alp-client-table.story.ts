import { defineStory } from './_types';

export default defineStory({
    component: 'AlpClientTable',
    group: 'Components',
    title: 'Client Table',
    description:
        'Client-side DataTable shell — caller passes the full item array and an optional DataTableFilterMeta; columns are declared via a default-slot Column list; falls back to AlpEmptySection when items is empty. Row detail goes in the #expansion slot with a `<Column expander />` (conventionally leftmost); v-model:expandedRows takes an array of rows, and row-expand/row-collapse fire so callers can lazy-load detail.',
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
            },
            slots: {
                default: '<Column field="name" header="Device" /><Column field="status" header="Status" />'
            }
        },
        {
            name: 'row expansion',
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
                        status: 'offline'
                    }
                ],
                expandedRows: [
                    {
                        id: '1',
                        name: 'edge-node-01',
                        status: 'online'
                    }
                ]
            },
            slots: {
                default:
                    '<Column expander style="width: 3rem" /><Column field="name" header="Device" /><Column field="status" header="Status" />',
                expansion:
                    '<div class="px-5 py-4 text-sm text-surface-600">Row detail renders inside the table, beneath its own row.</div>'
            }
        },
        {
            name: 'empty',
            props: {
                items: [],
                loading: false
            },
            slots: {
                default: '<Column field="name" header="Device" /><Column field="status" header="Status" />'
            }
        }
    ],
    snippet:
        '<AlpClientTable :items="nodes" v-model:filters="filters">\n  <Column field="name" header="Device" />\n  <Column field="status" header="Status" />\n</AlpClientTable>',
    sourcePath: 'components/alp/AlpClientTable.vue'
});
