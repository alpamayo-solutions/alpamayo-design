import { defineStory } from './_types';

export default defineStory({
    component: 'AlpConfirmDialog',
    group: 'Signature',
    title: 'Confirm Dialog',
    description:
        'Unified confirm modal — delete-style (title/message/emphasized entityName) and action-style (optional notes, custom confirm label/icon/severity) behind one contract.',
    variants: [
        {
            name: 'delete',
            props: {
                visible: true,
                title: 'Delete device',
                message: 'Delete device',
                entityName: 'edge-node-01'
            }
        },
        {
            name: 'action-with-notes',
            props: {
                visible: true,
                title: 'Set target revision',
                message: 'Set target revision a1b2c3d on edge-node-07?',
                withNotes: true,
                confirmLabel: 'Set target',
                confirmIcon: 'pi pi-arrow-right',
                confirmSeverity: 'primary'
            }
        },
        {
            name: 'error',
            props: {
                visible: true,
                title: 'Delete device',
                message: 'Delete device',
                entityName: 'edge-node-01',
                error: 'Delete failed: device is online.'
            }
        }
    ],
    snippet:
        '<AlpConfirmDialog\n  v-model:visible="showDialog"\n  title="Delete device"\n  message="Delete device"\n  entity-name="edge-node-01"\n  :loading="deleting"\n  @confirm="onConfirm"\n/>',
    sourcePath: 'components/alp/AlpConfirmDialog.vue'
});
