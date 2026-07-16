import { defineStory } from './_types';

export default defineStory({
    component: 'AlpSectionHeader',
    group: 'Foundations',
    title: 'Section Header',
    description: 'Uppercase section title used above grouped content blocks (e.g. a color scale list).',
    variants: [
        {
            name: 'default',
            props: {
                label: 'Fleet Overview'
            }
        }
    ],
    snippet: '<AlpSectionHeader label="Fleet Overview" />',
    sourcePath: 'components/alp/AlpSectionHeader.vue'
});
