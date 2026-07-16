import { defineStory } from './_types';

export default defineStory({
    component: 'VoltSelect',
    group: 'Components',
    title: 'Select',
    description: 'Single-value dropdown select.',
    variants: [
        {
            name: 'default',
            props: {
                modelValue: 'production',
                options: [
                    {
                        label: 'Production',
                        value: 'production'
                    },
                    {
                        label: 'Staging',
                        value: 'staging'
                    }
                ],
                optionLabel: 'label',
                optionValue: 'value'
            }
        },
        {
            name: 'clearable',
            props: {
                modelValue: 'staging',
                options: [
                    {
                        label: 'Production',
                        value: 'production'
                    },
                    {
                        label: 'Staging',
                        value: 'staging'
                    }
                ],
                optionLabel: 'label',
                optionValue: 'value',
                showClear: true
            }
        },
        {
            name: 'disabled',
            props: {
                modelValue: 'production',
                options: [
                    {
                        label: 'Production',
                        value: 'production'
                    }
                ],
                optionLabel: 'label',
                optionValue: 'value',
                disabled: true
            }
        }
    ],
    snippet:
        '<VoltSelect v-model="environment" :options="environments" optionLabel="label" optionValue="value" />',
    sourcePath: 'components/volt/Select.vue'
});
