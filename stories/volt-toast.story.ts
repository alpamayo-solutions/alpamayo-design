import { defineStory } from './_types';

export default defineStory({
    component: 'VoltToast',
    group: 'Components',
    title: 'Toast',
    description:
        'Global toast notification host driven by the ToastService. Renders nothing until toast.add() is called — story shows the always-mounted state.',
    variants: [
        {
            name: 'closed',
            props: {}
        }
    ],
    snippet:
        'const toast = useToast();\ntoast.add({ severity: "success", summary: "Deployed", detail: "edge-node-07 is on revision a1b2c3d", life: 3000 });\n<VoltToast />',
    sourcePath: 'components/volt/Toast.vue'
});
