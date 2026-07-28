import { defineStory } from './_types';

export default defineStory({
    component: 'AlpWorkbenchEditorSplit',
    group: 'Components',
    title: 'Workbench Editor Split',
    description: 'Resizable horizontal or vertical split for composing nested editor groups.',
    variants: [
        {
            name: 'horizontal',
            props: {
                splitId: 'editor-split-1',
                direction: 'horizontal',
                ratio: 0.5
            },
            slots: {
                first: '<div style="height:13.75rem;padding:1rem;background:var(--alp-workbench-surface)">Primary editor group</div>',
                second: '<AlpWorkbenchEditorSplit split-id="editor-split-2" direction="vertical" :ratio="0.55"><template #first><div style="height:13.75rem;padding:1rem;background:var(--alp-workbench-surface)">Nested editor</div></template><template #second><div style="height:13.75rem;padding:1rem;background:var(--alp-workbench-surface)">Nested editor</div></template></AlpWorkbenchEditorSplit>'
            }
        }
    ],
    snippet: '<AlpWorkbenchEditorSplit split-id="editor-split-1" direction="horizontal" :ratio="0.5" />',
    sourcePath: 'layers/workbench/components/EditorSplit.vue'
});
