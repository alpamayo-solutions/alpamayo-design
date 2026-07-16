import { defineStory } from './_types';

export default defineStory({
    component: 'VoltSecondaryButton',
    group: 'Components',
    title: 'SecondaryButton',
    description: 'Neutral-styled Button variant used for cancel/close actions and toolbar icons.',
    variants: [
        {
            name: 'default',
            props: {
                label: 'Cancel'
            }
        },
        {
            name: 'rounded-icon',
            props: {
                icon: 'pi pi-times',
                rounded: true
            }
        },
        {
            name: 'disabled',
            props: {
                label: 'Cancel',
                disabled: true
            }
        },
        {
            name: 'small',
            props: {
                label: 'Cancel',
                size: 'small'
            }
        }
    ],
    snippet: '<VoltSecondaryButton label="Cancel" />',
    sourcePath: 'components/volt/SecondaryButton.vue'
});
