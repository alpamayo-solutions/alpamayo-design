import { defineStory } from './_types';

export default defineStory({
    component: 'AlpDateChip',
    group: 'Components',
    title: 'Date Chip',
    description:
        'Inline due-date trigger that opens an anchored calendar dropdown. Icon-only when unset, flags overdue dates in danger color.',
    variants: [
        {
            name: 'unset',
            props: { dueDate: null }
        },
        {
            name: 'upcoming',
            props: { dueDate: '2099-01-01' }
        },
        {
            name: 'overdue',
            props: { dueDate: '2020-01-01' }
        },
        {
            name: 'disabled',
            props: { dueDate: '2099-01-01', disabled: true }
        }
    ],
    snippet: '<AlpDateChip :due-date="task.dueDate" @update="onDueDateChange" />',
    sourcePath: 'components/alp/AlpDateChip.vue'
});
