import { defineStory } from './_types';

export default defineStory({
    component: 'VoltCheckbox',
    group: 'Components',
    title: 'Checkbox',
    description: 'Binary checkbox input, checked/unchecked/disabled/invalid states.',
    variants: [
        {
            name: 'checked',
            props: {
                modelValue: true,
                binary: true
            }
        },
        {
            name: 'unchecked',
            props: {
                modelValue: false,
                binary: true
            }
        },
        {
            name: 'disabled',
            props: {
                modelValue: true,
                binary: true,
                disabled: true
            }
        },
        {
            name: 'invalid',
            props: {
                modelValue: false,
                binary: true,
                invalid: true
            }
        }
    ],
    snippet: '<VoltCheckbox v-model="acceptTerms" binary />',
    sourcePath: 'components/volt/Checkbox.vue'
});
