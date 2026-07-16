import { defineStory } from './_types';

export default defineStory({
    component: 'VoltDivider',
    group: 'Components',
    title: 'Divider',
    description: 'Visual separator between sections, horizontal or vertical.',
    variants: [
        {
            name: 'horizontal',
            props: {}
        },
        {
            name: 'vertical',
            props: {
                layout: 'vertical'
            }
        },
        {
            name: 'dashed',
            props: {
                type: 'dashed'
            }
        }
    ],
    snippet: '<VoltDivider />\n<VoltDivider layout="vertical" />',
    sourcePath: 'components/volt/Divider.vue'
});
