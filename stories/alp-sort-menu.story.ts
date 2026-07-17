import { defineStory } from './_types';

export default defineStory({
    component: 'AlpSortMenu',
    group: 'Components',
    title: 'Sort Menu',
    description:
        'Generic sort-field combobox plus an asc/desc direction toggle. The caller supplies its own `options`, including any "manual/unsorted" entry.',
    variants: [
        {
            name: 'unsorted',
            props: {
                options: [
                    { key: '', label: 'Manual' },
                    { key: 'created', label: 'Created' },
                    { key: 'name', label: 'Name' }
                ],
                modelValue: '',
                dir: 'asc'
            }
        },
        {
            name: 'sorted-desc',
            props: {
                options: [
                    { key: '', label: 'Manual' },
                    { key: 'created', label: 'Created' },
                    { key: 'name', label: 'Name' }
                ],
                modelValue: 'created',
                dir: 'desc'
            }
        }
    ],
    snippet: '<AlpSortMenu :options="sortOptions" v-model="sortField" v-model:dir="sortDir" />',
    sourcePath: 'components/alp/AlpSortMenu.vue'
});
