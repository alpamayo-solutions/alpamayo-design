import { defineStory } from './_types';

export default defineStory({
    component: 'AlpListToolbar',
    group: 'Signature',
    title: 'List Toolbar',
    description: 'Search + filter-chip + saved-view toolbar used above data lists.',
    variants: [
        {
            name: 'default',
            props: {
                search: '',
                searchPlaceholder: 'Search devices…',
                chips: [
                    {
                        key: 'status',
                        label: 'Status',
                        value: 'Online'
                    }
                ],
                totalCount: 21,
                totalLabel: 'devices'
            }
        },
        {
            name: 'no-filters',
            props: {
                chips: [],
                totalCount: 8,
                totalLabel: 'projects'
            }
        }
    ],
    snippet:
        '<AlpListToolbar v-model:search="search" :chips="activeChips" :total-count="21" total-label="devices" />',
    sourcePath: 'components/alp/AlpListToolbar.vue'
});
