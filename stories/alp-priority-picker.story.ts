import { defineStory } from './_types';

export default defineStory({
    component: 'AlpPriorityPicker',
    group: 'Components',
    title: 'Priority Picker',
    description: 'Inline priority chip that opens a popup menu of priority levels. Emit-only.',
    variants: [
        {
            name: 'unset',
            props: {}
        },
        {
            name: 'low',
            props: { priority: 1 }
        },
        {
            name: 'medium',
            props: { priority: 2 }
        },
        {
            name: 'high',
            props: { priority: 3 }
        },
        {
            name: 'disabled',
            props: { priority: 2, disabled: true }
        }
    ],
    snippet: '<AlpPriorityPicker :priority="card.priority" @update="onPriorityChange" />',
    sourcePath: 'components/alp/AlpPriorityPicker.vue'
});
