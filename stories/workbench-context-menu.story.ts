import { defineStory } from './_types';

export default defineStory({
    component: 'AlpWorkbenchContextMenu',
    group: 'Components',
    title: 'Workbench Context Menu',
    description: 'PrimeVue popup menu adapter for domain-provided workbench actions.',
    variants: [
        {
            name: 'entity-actions',
            props: {
                items: [
                    { id: 'edit', label: 'Edit', icon: 'pi pi-pencil' },
                    { id: 'delete', label: 'Delete', icon: 'pi pi-trash', destructive: true }
                ]
            }
        }
    ],
    snippet: '<AlpWorkbenchContextMenu ref="menu" :items="actions" @select="runAction" />',
    sourcePath: 'layers/workbench/components/ContextMenu.vue'
});
