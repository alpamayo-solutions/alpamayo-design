import { defineStory } from './_types';

export default defineStory({
    component: 'VoltDatePicker',
    group: 'Components',
    title: 'DatePicker',
    description: 'Calendar date input, optional trigger icon.',
    variants: [
        {
            name: 'default',
            props: {
                placeholder: 'Select date'
            }
        },
        {
            name: 'with-icon',
            props: {
                placeholder: 'Select date',
                showIcon: true
            }
        },
        {
            name: 'disabled',
            props: {
                placeholder: 'Select date',
                disabled: true
            }
        },
        {
            name: 'invalid',
            props: {
                placeholder: 'Select date',
                invalid: true
            }
        }
    ],
    snippet: '<VoltDatePicker v-model="date" showIcon />',
    sourcePath: 'components/volt/DatePicker.vue'
});
