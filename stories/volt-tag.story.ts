import { defineStory } from './_types';

export default defineStory({
    component: 'VoltTag',
    group: 'Components',
    title: 'Tag',
    description: 'Compact status label, one per severity.',
    variants: [
        {
            name: 'success',
            props: {
                value: 'Deployed',
                severity: 'success'
            }
        },
        {
            name: 'info',
            props: {
                value: 'Planning',
                severity: 'info'
            }
        },
        {
            name: 'warn',
            props: {
                value: 'Paused',
                severity: 'warn'
            }
        },
        {
            name: 'danger',
            props: {
                value: 'Failed',
                severity: 'danger'
            }
        },
        {
            name: 'secondary',
            props: {
                value: 'Archived',
                severity: 'secondary'
            }
        }
    ],
    snippet: '<VoltTag value="Deployed" severity="success" />',
    sourcePath: 'components/volt/Tag.vue'
});
