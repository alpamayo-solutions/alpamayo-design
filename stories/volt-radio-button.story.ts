import { defineStory } from './_types';

export default defineStory({
    component: 'VoltRadioButton',
    group: 'Components',
    title: 'RadioButton',
    description: 'Single-select radio input within a named group.',
    variants: [
        {
            name: 'selected',
            props: {
                modelValue: 'canary',
                value: 'canary',
                name: 'rollout-mode'
            }
        },
        {
            name: 'unselected',
            props: {
                modelValue: 'canary',
                value: 'full',
                name: 'rollout-mode'
            }
        },
        {
            name: 'disabled',
            props: {
                modelValue: 'canary',
                value: 'canary',
                name: 'rollout-mode',
                disabled: true
            }
        }
    ],
    snippet: '<VoltRadioButton v-model="mode" value="canary" name="rollout-mode" />',
    sourcePath: 'components/volt/RadioButton.vue'
});
