import { defineStory } from './_types';

export default defineStory({
    component: 'VoltInputMask',
    group: 'Components',
    title: 'InputMask',
    description: 'Masked text input, e.g. for IP addresses or serial numbers.',
    variants: [
        {
            name: 'default',
            props: {
                mask: '999.999.999.999',
                modelValue: '192.168.010.007',
                placeholder: 'IP address'
            }
        },
        {
            name: 'disabled',
            props: {
                mask: '999.999.999.999',
                disabled: true
            }
        }
    ],
    snippet: '<VoltInputMask v-model="ip" mask="999.999.999.999" placeholder="IP address" />',
    sourcePath: 'components/volt/InputMask.vue'
});
