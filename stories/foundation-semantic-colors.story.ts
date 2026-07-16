import { defineStory } from './_types';

export default defineStory({
    component: 'AlpSemanticColorRow',
    group: 'Foundations',
    title: 'Semantic Colors',
    description: 'Status-meaning scales — success, warning, danger, info, help.',
    variants: [
        {
            name: 'success',
            props: {
                colorKey: 'success',
                steps: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
            }
        },
        {
            name: 'warning',
            props: {
                colorKey: 'warning',
                steps: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
            }
        },
        {
            name: 'danger',
            props: {
                colorKey: 'danger',
                steps: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
            }
        },
        {
            name: 'info',
            props: {
                colorKey: 'info',
                steps: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
            }
        },
        {
            name: 'help',
            props: {
                colorKey: 'help',
                steps: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
            }
        }
    ],
    snippet:
        '<AlpSemanticColorRow color-key="danger" :steps="[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]" />',
    sourcePath: 'components/alp/AlpSemanticColorRow.vue'
});
