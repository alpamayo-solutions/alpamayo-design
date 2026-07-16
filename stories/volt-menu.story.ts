import { defineStory } from './_types';

export default defineStory({
    component: 'VoltMenu',
    group: 'Components',
    title: 'Menu',
    description: 'Vertical list of navigational or action items.',
    variants: [
        {
            name: 'default',
            props: {
                model: [
                    {
                        label: 'Edit'
                    },
                    {
                        label: 'Move'
                    },
                    {
                        separator: true
                    },
                    {
                        label: 'Delete'
                    }
                ]
            }
        }
    ],
    snippet: '<VoltMenu :model="items" />',
    sourcePath: 'components/volt/Menu.vue'
});
