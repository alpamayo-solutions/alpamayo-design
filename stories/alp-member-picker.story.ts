import { defineStory } from './_types';

export default defineStory({
    component: 'AlpMemberPicker',
    group: 'Signature',
    title: 'Member Picker',
    description:
        'Single-select avatar/label chip that opens a popup menu of members plus an "unassigned" row. Driven by a generic `MemberOption[]` — no app member type baked in.',
    variants: [
        {
            name: 'unselected',
            props: {
                options: [
                    { id: 'u1', label: 'Alex Doe' },
                    { id: 'u2', label: 'Kim Muster' }
                ],
                modelValue: null
            }
        },
        {
            name: 'selected',
            props: {
                options: [
                    { id: 'u1', label: 'Alex Doe' },
                    { id: 'u2', label: 'Kim Muster' }
                ],
                modelValue: 'u2'
            }
        }
    ],
    snippet: '<AlpMemberPicker :options="memberOptions" v-model="assigneeId" />',
    sourcePath: 'components/alp/AlpMemberPicker.vue'
});
