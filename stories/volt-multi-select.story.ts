import { defineStory } from './_types';

export default defineStory({
    component: 'VoltMultiSelect',
    group: 'Components',
    title: 'MultiSelect',
    description: 'Multi-value dropdown, comma or chip display.',
    variants: [
        {
            name: 'default',
            props: {
                modelValue: ['online'],
                options: [
                    {
                        label: 'Online',
                        value: 'online'
                    },
                    {
                        label: 'Offline',
                        value: 'offline'
                    },
                    {
                        label: 'Degraded',
                        value: 'degraded'
                    }
                ],
                optionLabel: 'label',
                optionValue: 'value',
                placeholder: 'Filter status'
            }
        },
        {
            name: 'chips',
            props: {
                modelValue: ['online', 'degraded'],
                options: [
                    {
                        label: 'Online',
                        value: 'online'
                    },
                    {
                        label: 'Degraded',
                        value: 'degraded'
                    }
                ],
                optionLabel: 'label',
                optionValue: 'value',
                display: 'chip'
            }
        }
    ],
    snippet:
        '<VoltMultiSelect v-model="statuses" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Filter status" />',
    sourcePath: 'components/volt/MultiSelect.vue'
});
