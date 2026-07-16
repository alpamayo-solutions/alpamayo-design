import { defineStory } from './_types';

export default defineStory({
    component: 'AlpEyebrow',
    group: 'Foundations',
    title: 'Eyebrow',
    description: 'Small uppercase label used above section content or as a category tag.',
    variants: [
        {
            name: 'default',
            props: {
                label: 'Fleet Overview'
            }
        },
        {
            name: 'via-slot',
            slots: {
                default: 'Custom label content'
            }
        }
    ],
    snippet: '<AlpEyebrow label="Fleet Overview" />',
    sourcePath: 'components/alp/AlpEyebrow.vue'
});
