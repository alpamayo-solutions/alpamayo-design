import { defineStory } from './_types';

export default defineStory({
    component: 'AlpFilterChip',
    group: 'Signature',
    title: 'Filter Chip',
    description: 'Active-filter chip shown in list toolbars, optionally removable.',
    variants: [
        {
            name: 'plain',
            props: {
                label: 'Status'
            }
        },
        {
            name: 'with-value',
            props: {
                label: 'Status',
                value: 'Online'
            }
        },
        {
            name: 'removable',
            props: {
                label: 'Org',
                value: 'Line 4 retrofit',
                removable: true
            }
        }
    ],
    snippet: '<AlpFilterChip label="Status" value="Online" removable @remove="onRemove" />',
    sourcePath: 'components/alp/AlpFilterChip.vue'
});
