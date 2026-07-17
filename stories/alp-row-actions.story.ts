import { defineStory } from './_types';

export default defineStory({
    component: 'AlpRowActions',
    group: 'Components',
    title: 'Row Actions',
    description:
        'Kebab action menu for DataTable rows. Pass `items` to render a caller-built MenuItem[] verbatim, or omit it for the common edit/delete pair.',
    variants: [
        {
            name: 'edit-delete-pair',
            props: {
                editLink: '/fleet/edge-node-04'
            }
        },
        {
            name: 'custom-delete-label',
            props: {
                deleteLabel: 'Remove device'
            }
        },
        {
            name: 'custom-items',
            props: {
                items: [
                    { label: 'Archive', icon: 'pi pi-box' },
                    { label: 'Duplicate', icon: 'pi pi-copy' },
                    { label: 'Delete', icon: 'pi pi-trash', class: 'text-danger-600' }
                ]
            }
        }
    ],
    snippet: '<AlpRowActions edit-link="/fleet/edge-node-04" @delete="onDelete" />',
    sourcePath: 'components/alp/AlpRowActions.vue'
});
