import { defineStory } from './_types';

export default defineStory({
    component: 'AlpWorkbenchEditorGroup',
    group: 'Components',
    title: 'Workbench Editor Group',
    description: 'Focused editor frame with draggable tabs, split actions, and a content surface.',
    variants: [
        {
            name: 'focused',
            props: {
                groupId: 'editor-group-1',
                activeId: 'fill-level',
                focused: true,
                draggable: true,
                showCloseAction: true,
                tabs: [
                    { id: 'fill-level', label: 'Fill level', icon: 'pi pi-chart-line' },
                    { id: 'alarm', label: 'New alarm', icon: 'pi pi-bell', dirty: true }
                ]
            },
            slots: {
                default:
                    '<div style="height:13.75rem;padding:1rem;background:var(--alp-workbench-surface)">Fill level editor</div>'
            }
        }
    ],
    snippet:
        '<AlpWorkbenchEditorGroup group-id="editor-group-1" :tabs="tabs" active-id="fill-level" focused show-close-action />',
    sourcePath: 'layers/workbench/components/EditorGroup.vue'
});
