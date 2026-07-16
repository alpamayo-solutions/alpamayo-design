import { defineStory } from './_types';

export default defineStory({
    component: 'VoltInputNumber',
    group: 'Components',
    title: 'InputNumber',
    description: 'Numeric input with optional prefix/suffix and stepper buttons.',
    variants: [
        {
            name: 'default',
            props: {
                modelValue: 42,
                suffix: ' °C'
            }
        },
        {
            name: 'buttons',
            props: {
                modelValue: 10,
                showButtons: true,
                min: 0,
                max: 100
            }
        },
        {
            name: 'disabled',
            props: {
                modelValue: 5,
                disabled: true
            }
        }
    ],
    snippet: '<VoltInputNumber v-model="threshold" suffix=" °C" />',
    sourcePath: 'components/volt/InputNumber.vue'
});
