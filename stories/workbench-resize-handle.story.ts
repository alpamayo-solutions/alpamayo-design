import { defineStory } from './_types';

export default defineStory({
    component: 'AlpWorkbenchResizeHandle',
    group: 'Components',
    title: 'Workbench Resize Handle',
    description: 'Pointer and keyboard accessible separator for resizable workbench regions.',
    variants: [{ name: 'vertical', props: { value: 292, min: 208, max: 512 } }],
    snippet: '<AlpWorkbenchResizeHandle :value="292" @resize="resizeBy" />',
    sourcePath: 'layers/workbench/components/ResizeHandle.vue'
});
