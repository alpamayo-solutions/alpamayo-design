import { defineStory } from './_types';

export default defineStory({
    component: 'VoltSplitButton',
    group: 'Components',
    title: 'SplitButton',
    description: 'Primary action with an attached dropdown of secondary actions.',
    variants: [
        {
            name: 'default',
            props: {
                label: 'Deploy',
                model: [
                    {
                        label: 'Deploy canary'
                    },
                    {
                        label: 'Roll back'
                    }
                ]
            }
        },
        {
            name: 'danger',
            props: {
                label: 'Delete',
                severity: 'danger',
                model: [
                    {
                        label: 'Archive instead'
                    }
                ]
            }
        }
    ],
    snippet: '<VoltSplitButton label="Deploy" :model="rolloutActions" />',
    sourcePath: 'components/volt/SplitButton.vue'
});
