import { defineStory } from './_types';

export default defineStory({
    component: 'VoltInputText',
    group: 'Components',
    title: 'InputText',
    description: 'Single-line text input.',
    variants: [
        {
            name: 'default',
            props: {
                modelValue: 'edge-node-07',
                placeholder: 'Device name'
            }
        },
        {
            name: 'disabled',
            props: {
                modelValue: 'edge-node-07',
                disabled: true
            }
        },
        {
            name: 'invalid',
            props: {
                modelValue: '',
                placeholder: 'Device name',
                invalid: true
            }
        },
        {
            name: 'small',
            props: {
                modelValue: 'edge-node-07',
                size: 'small'
            }
        }
    ],
    snippet: '<VoltInputText v-model="deviceName" placeholder="Device name" />',
    sourcePath: 'components/volt/InputText.vue'
});
