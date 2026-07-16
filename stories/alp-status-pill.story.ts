import { defineStory } from './_types';

export default defineStory({
    component: 'AlpStatusPill',
    group: 'Signature',
    title: 'Status Pill',
    description: 'Labelled status pill/chip, one per severity.',
    variants: [
        {
            name: 'success',
            props: {
                label: 'Deployed',
                severity: 'success',
                dot: true
            }
        },
        {
            name: 'warning',
            props: {
                label: 'Paused',
                severity: 'warning'
            }
        },
        {
            name: 'danger',
            props: {
                label: 'Failed',
                severity: 'danger'
            }
        },
        {
            name: 'info',
            props: {
                label: 'Planning',
                severity: 'info'
            }
        },
        {
            name: 'help',
            props: {
                label: 'Advisory',
                severity: 'help'
            }
        },
        {
            name: 'neutral',
            props: {
                label: 'Archived',
                severity: 'neutral'
            }
        }
    ],
    snippet: '<AlpStatusPill label="Deployed" severity="success" dot />',
    sourcePath: 'components/alp/AlpStatusPill.vue'
});
