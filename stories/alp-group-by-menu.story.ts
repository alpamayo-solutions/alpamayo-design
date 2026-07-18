import { defineStory } from './_types';

export default defineStory({
    component: 'AlpGroupByMenu',
    group: 'Components',
    title: 'Group By Menu',
    description:
        'Generic single-select group-by combobox. The caller supplies its own `options` — no domain vocabulary is baked in.',
    variants: [
        {
            name: 'device-fields',
            props: {
                options: [
                    { key: 'status', label: 'Status' },
                    { key: 'site', label: 'Site' },
                    { key: 'type', label: 'Device type' }
                ],
                modelValue: 'status'
            }
        },
        {
            name: 'project-fields',
            props: {
                options: [
                    { key: 'owner', label: 'Owner' },
                    { key: 'phase', label: 'Phase' }
                ],
                modelValue: 'phase'
            }
        }
    ],
    snippet: '<AlpGroupByMenu :options="groupByOptions" v-model="groupBy" />',
    sourcePath: 'components/alp/AlpGroupByMenu.vue'
});
