import { defineStory } from './_types';

export default defineStory({
    component: 'AlpListSkeleton',
    group: 'Components',
    title: 'List Skeleton',
    description: 'Table-shaped loading skeleton — header bar plus shimmering rows.',
    variants: [
        {
            name: 'default',
            props: {}
        },
        {
            name: 'five-rows',
            props: {
                rows: 5
            }
        }
    ],
    snippet: '<AlpListSkeleton :rows="5" />',
    sourcePath: 'components/alp/AlpListSkeleton.vue'
});
