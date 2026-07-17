import { defineStory } from './_types';

export default defineStory({
    component: 'AlpDetailActions',
    group: 'Components',
    title: 'Detail Actions',
    description:
        'Header action row for detail pages: inline Edit link plus an overflow menu hosting destructive actions, so they can never be triggered by a stray click.',
    variants: [
        {
            name: 'edit-only',
            props: {
                showEdit: true,
                editHref: '/projects/edge-node-04'
            }
        },
        {
            name: 'with-destructive-overflow',
            props: {
                showEdit: true,
                editHref: '/projects/edge-node-04',
                destructiveLabel: 'Delete project'
            }
        },
        {
            name: 'extra-overflow-items',
            props: {
                destructiveLabel: 'Archive project',
                extraOverflowItems: [{ label: 'Export', icon: 'pi pi-download' }]
            }
        }
    ],
    snippet: '<AlpDetailActions show-edit edit-href="/projects/edge-node-04" destructive-label="Delete project" @delete="onDelete" />',
    sourcePath: 'components/alp/AlpDetailActions.vue'
});
