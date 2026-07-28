import { defineStory } from './_types';

export default defineStory({
    component: 'AlpWorkbenchTabStrip',
    group: 'Components',
    title: 'Workbench Tab Strip',
    description: 'Closable editor tabs with preview and unsaved-state treatments.',
    variants: [
        {
            name: 'editor-tabs',
            props: {
                activeId: 'fill-level',
                tabs: [
                    { id: 'fill-level', label: 'Fill level', icon: 'pi pi-chart-line' },
                    { id: 'alarm', label: 'New alarm', icon: 'pi pi-bell', dirty: true }
                ]
            }
        }
    ],
    snippet: '<AlpWorkbenchTabStrip :tabs="tabs" active-id="fill-level" />',
    sourcePath: 'layers/workbench/components/TabStrip.vue'
});
