import { defineStory } from './_types';

export default defineStory({
    component: 'AlpQuickCreateCard',
    group: 'Signature',
    title: 'Quick Create Card',
    description:
        'Presentational quick-create card: title input + inline assignee/type/label/project pickers. Emit-only — no persistence, no label creation (the app wrapper owns that and only ever hands this shell a resolved labelOptions list).',
    variants: [
        {
            name: 'single-project',
            props: {
                assigneeOptions: [
                    { id: 'u1', label: 'Alex Doe' },
                    { id: 'u2', label: 'Kim Muster' }
                ],
                labelOptions: [
                    { id: 'l1', label: 'Bug', color: '#ef4444' },
                    { id: 'l2', label: 'Feature', color: '#3b82f6' }
                ],
                typeOptions: [
                    { key: 'task', label: 'Task' },
                    { key: 'bug', label: 'Bug' }
                ],
                projectName: 'Demo Project'
            }
        },
        {
            name: 'multi-project',
            props: {
                assigneeOptions: [
                    { id: 'u1', label: 'Alex Doe' },
                    { id: 'u2', label: 'Kim Muster' }
                ],
                labelOptions: [{ id: 'l1', label: 'Bug', color: '#ef4444' }],
                projectOptions: [
                    { slug: 'demo', label: 'Demo Project' },
                    { slug: 'sandbox', label: 'Sandbox Project' }
                ],
                creating: false
            }
        },
        {
            name: 'with-controls-extra',
            props: {
                assigneeOptions: [
                    { id: 'u1', label: 'Alex Doe' },
                    { id: 'u2', label: 'Kim Muster' }
                ],
                labelOptions: [{ id: 'l1', label: 'Bug', color: '#ef4444' }],
                projectName: 'Demo Project'
            },
            slots: {
                'controls-extra': '<button class="text-xs">Priority</button>'
            }
        }
    ],
    snippet:
        '<AlpQuickCreateCard\n  :assignee-options="assigneeOptions"\n  :label-options="labelOptions"\n  :type-options="typeOptions"\n  :project-options="projectOptions"\n  :creating="creating"\n  @create="onCreate"\n  @cancel="onCancel"\n/>',
    sourcePath: 'components/alp/AlpQuickCreateCard.vue'
});
