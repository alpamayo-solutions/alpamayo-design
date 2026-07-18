import { defineStory } from './_types';

export default defineStory({
    component: 'AlpCardSkeleton',
    group: 'Components',
    title: 'Card Skeleton',
    description: 'Loading placeholder for a single board/list card — title, subtitle, avatar and tag bars.',
    variants: [
        {
            name: 'default',
            props: {}
        },
        {
            name: 'no-tag',
            props: {
                showTag: false
            }
        }
    ],
    snippet: '<AlpCardSkeleton />',
    sourcePath: 'components/alp/AlpCardSkeleton.vue'
});
