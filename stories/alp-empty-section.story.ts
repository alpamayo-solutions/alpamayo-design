import { defineStory } from './_types';

export default defineStory({
    component: 'AlpEmptySection',
    group: 'Signature',
    title: 'Empty Section',
    description: 'Placeholder for a section with no content, one per severity plus an optional CTA.',
    variants: [
        {
            name: 'default',
            props: {
                message: 'No linked machines yet.'
            }
        },
        {
            name: 'success',
            props: {
                message: 'All checks passed.',
                severity: 'success',
                icon: 'pi pi-check-circle'
            }
        },
        {
            name: 'info',
            props: {
                message: 'No rollouts scheduled.',
                severity: 'info',
                icon: 'pi pi-info-circle'
            }
        },
        {
            name: 'warn',
            props: {
                message: 'Some sensors need calibration.',
                severity: 'warn',
                icon: 'pi pi-exclamation-triangle'
            }
        },
        {
            name: 'danger',
            props: {
                message: 'No connectivity for 3 devices.',
                severity: 'danger',
                icon: 'pi pi-times-circle'
            }
        },
        {
            name: 'with-action',
            props: {
                message: 'No infrastructure configured.',
                actionLabel: 'Add infrastructure',
                actionHref: '/'
            }
        }
    ],
    snippet: '<AlpEmptySection message="No linked machines yet." icon="pi pi-inbox" severity="info" />',
    sourcePath: 'components/alp/AlpEmptySection.vue'
});
