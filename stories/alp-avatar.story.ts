import { defineStory } from './_types';

export default defineStory({
    component: 'AlpAvatar',
    group: 'Signature',
    title: 'Avatar',
    description: 'Circular initials avatar with configurable size and background.',
    variants: [
        {
            name: 'default',
            props: {
                initials: 'TN'
            }
        },
        {
            name: 'large',
            props: {
                initials: 'CN',
                size: 'w-12 h-12 text-base'
            }
        },
        {
            name: 'custom-color',
            props: {
                initials: 'AL',
                bgColor: '#7c3aed'
            }
        }
    ],
    snippet: '<AlpAvatar initials="TN" />',
    sourcePath: 'components/alp/AlpAvatar.vue'
});
