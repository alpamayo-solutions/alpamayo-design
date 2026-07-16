import { defineStory } from './_types';

export default defineStory({
    component: 'VoltConfirmDialog',
    group: 'Components',
    title: 'ConfirmDialog',
    description:
        'Global confirmation modal driven by the ConfirmationService. Renders nothing until confirm.require() is called — story shows the closed, always-mounted state.',
    variants: [
        {
            name: 'closed',
            props: {}
        }
    ],
    snippet:
        'const confirm = useConfirm();\nconfirm.require({ message: "Delete edge-node-07?", header: "Confirm", acceptProps: { severity: "danger" } });\n<VoltConfirmDialog />',
    sourcePath: 'components/volt/ConfirmDialog.vue'
});
