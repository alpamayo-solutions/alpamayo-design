import { defineStory } from './_types';

export default defineStory({
    component: 'VoltToggleSwitch',
    group: 'Components',
    title: 'ToggleSwitch',
    description: 'Two-state switch input.',
    variants: [
        {
            name: 'on',
            props: {
                modelValue: true
            }
        },
        {
            name: 'off',
            props: {
                modelValue: false
            }
        },
        {
            name: 'disabled',
            props: {
                modelValue: true,
                disabled: true
            }
        }
    ],
    snippet: '<VoltToggleSwitch v-model="notificationsEnabled" />',
    sourcePath: 'components/volt/ToggleSwitch.vue'
});
