import { defineStory } from './_types';

export default defineStory({
    component: 'AlpWorkbenchIconButton',
    group: 'Components',
    title: 'Workbench Icon Button',
    description: 'Compact, accessible icon-only action for dense workbench chrome.',
    variants: [
        { name: 'default', props: { label: 'Settings', icon: 'pi pi-sliders-h' } },
        { name: 'active', props: { label: 'Pinned', icon: 'pi pi-thumbtack', active: true } }
    ],
    snippet: '<AlpWorkbenchIconButton label="Settings" icon="pi pi-sliders-h" />',
    sourcePath: 'layers/workbench/components/IconButton.vue'
});
