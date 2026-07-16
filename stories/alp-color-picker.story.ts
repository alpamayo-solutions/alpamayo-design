import { defineStory } from './_types';

export default defineStory({
    component: 'AlpColorPicker',
    group: 'Signature',
    title: 'Color Picker',
    description: 'Native color swatch input, used e.g. for custom preset colors.',
    variants: [
        {
            name: 'default',
            props: {
                modelValue: '#2563eb'
            }
        },
        {
            name: 'small',
            props: {
                modelValue: '#f97316',
                size: 'w-6 h-6 rounded-md'
            }
        }
    ],
    snippet: '<AlpColorPicker v-model="presetColor" />',
    sourcePath: 'components/alp/AlpColorPicker.vue'
});
