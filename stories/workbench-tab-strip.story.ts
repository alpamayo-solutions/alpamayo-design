import { defineStory } from './_types';

export default defineStory({
    component: 'AlpWorkbenchTabStrip',
    group: 'Components',
    title: 'Workbench Tab Strip',
    description:
        'Closable editor tabs with preview and unsaved-state treatments. Arrow keys, Home/End and Shift+Tab activate tabs; Delete requests close. The active tab is kept in view. The unsaved marker and the close buttons are named through `dirty-label` and `close-label` (English by default).',
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
    snippet:
        '<AlpWorkbenchTabStrip :tabs="tabs" active-id="fill-level" :dirty-label="t(\'tabs.unsaved\')" :close-label="(name) => t(\'tabs.close\', { name })" @select="activateTab" @close="requestClose" />',
    sourcePath: 'layers/workbench/components/TabStrip.vue'
});
