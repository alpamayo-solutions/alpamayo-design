import { defineStory } from './_types';

export default defineStory({
    component: 'AlpMemberFilter',
    group: 'Signature',
    title: 'Member Filter',
    description:
        'Multi-select member combobox for board toolbars — the selected value renders as stacked avatars/initials only (never names), plus a `+N` overflow marker beyond 3.',
    variants: [
        {
            name: 'none-selected',
            props: {
                options: [
                    { id: 'u1', label: 'Alex Doe' },
                    { id: 'u2', label: 'Kim Muster' }
                ],
                modelValue: []
            }
        },
        {
            name: 'four-selected',
            props: {
                options: [
                    { id: 'u1', label: 'Alex Doe' },
                    { id: 'u2', label: 'Kim Muster' },
                    { id: 'u3', label: 'Sam Lee' },
                    { id: 'u4', label: 'Jo Novak' }
                ],
                modelValue: ['u1', 'u2', 'u3', 'u4']
            }
        }
    ],
    snippet: '<AlpMemberFilter :options="memberOptions" v-model="selectedMemberIds" />',
    sourcePath: 'components/alp/AlpMemberFilter.vue'
});
