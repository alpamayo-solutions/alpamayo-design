import { defineStory } from './_types';

export default defineStory({
    component: 'VoltSkeleton',
    group: 'Components',
    title: 'Skeleton',
    description: 'Loading placeholder shapes.',
    variants: [
        {
            name: 'text',
            props: {
                width: '12rem',
                height: '1rem'
            }
        },
        {
            name: 'circle',
            props: {
                shape: 'circle',
                size: '3rem'
            }
        },
        {
            name: 'block',
            props: {
                width: '100%',
                height: '6rem'
            }
        }
    ],
    snippet: '<VoltSkeleton width="12rem" height="1rem" />',
    sourcePath: 'components/volt/Skeleton.vue'
});
