import { defineStory } from './_types';

export default defineStory({
    component: 'VoltTextarea',
    group: 'Components',
    title: 'Textarea',
    description: 'Multi-line text input.',
    variants: [
        {
            name: 'default',
            props: {
                modelValue: 'Deployment blocked by cert renewal.',
                rows: 3
            }
        },
        {
            name: 'disabled',
            props: {
                modelValue: 'Deployment blocked by cert renewal.',
                rows: 3,
                disabled: true
            }
        }
    ],
    snippet: '<VoltTextarea v-model="note" rows="3" placeholder="Add a note…" />',
    sourcePath: 'components/volt/Textarea.vue'
});
