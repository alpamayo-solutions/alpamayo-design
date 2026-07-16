import { defineStory } from './_types';

export default defineStory({
    component: 'VoltAvatar',
    group: 'Components',
    title: 'Avatar',
    description: 'Compact user or entity representation — initials, icon, or image.',
    variants: [
        {
            name: 'label',
            props: {
                label: 'TN'
            }
        },
        {
            name: 'icon',
            props: {
                icon: 'pi pi-user'
            }
        },
        {
            name: 'large',
            props: {
                label: 'CN',
                size: 'large'
            }
        },
        {
            name: 'square',
            props: {
                label: 'AL',
                shape: 'square'
            }
        }
    ],
    snippet: '<VoltAvatar label="TN" shape="circle" />',
    sourcePath: 'components/volt/Avatar.vue'
});
