import { defineStory } from './_types';

export default defineStory({
    component: 'VoltButton',
    group: 'Components',
    title: 'Button',
    description: 'Primary action component. Blue primary, neutral secondary; severity, outline/text, sizes.',
    variants: [
        {
            name: 'primary',
            props: {
                label: 'Save changes'
            }
        },
        {
            name: 'secondary',
            props: {
                label: 'Cancel',
                severity: 'secondary'
            }
        },
        {
            name: 'danger',
            props: {
                label: 'Delete',
                severity: 'danger'
            }
        },
        {
            name: 'outlined',
            props: {
                label: 'Outlined',
                outlined: true
            }
        },
        {
            name: 'text',
            props: {
                label: 'Text action',
                text: true
            }
        },
        {
            name: 'small',
            props: {
                label: 'Small',
                size: 'small'
            }
        },
        {
            name: 'disabled',
            props: {
                label: 'Disabled',
                disabled: true
            }
        }
    ],
    snippet: '<VoltButton label="Save changes" />\n<VoltButton label="Delete" severity="danger" />',
    sourcePath: 'components/volt/Button.vue'
});
