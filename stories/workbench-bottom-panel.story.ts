import { defineStory } from './_types';

export default defineStory({
    component: 'AlpWorkbenchBottomPanel',
    group: 'Components',
    title: 'Workbench Bottom Panel',
    description: 'Animated terminal/chat container whose activation also restores a collapsed panel.',
    variants: [
        {
            name: 'terminal-open',
            props: { open: true, mode: 'terminal' },
            slots: { terminal: '<div style="height:7rem;padding:0.75rem">prekit:~$</div>' }
        },
        {
            name: 'chat-open',
            props: { open: true, mode: 'chat' },
            slots: { chat: '<div style="height:7rem;padding:0.75rem">New assistant session</div>' }
        }
    ],
    snippet: '<AlpWorkbenchBottomPanel :open="panelOpen" mode="terminal" />',
    sourcePath: 'layers/workbench/components/BottomPanel.vue'
});
