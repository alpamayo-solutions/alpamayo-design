import { defineStory } from './_types';

export default defineStory({
    component: 'VoltToggleButton',
    group: 'Components',
    title: 'ToggleButton',
    description: 'Two-state labeled toggle button.',
    variants: [
        {
            name: 'on',
            props: {
                modelValue: true,
                onLabel: 'Enabled',
                offLabel: 'Disabled'
            }
        },
        {
            name: 'off',
            props: {
                modelValue: false,
                onLabel: 'Enabled',
                offLabel: 'Disabled'
            }
        }
    ],
    snippet: '<VoltToggleButton v-model="autoUpdate" onLabel="Enabled" offLabel="Disabled" />',
    sourcePath: 'components/volt/ToggleButton.vue'
});
