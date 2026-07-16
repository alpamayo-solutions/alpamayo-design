import { defineStory } from './_types';

export default defineStory({
    component: 'AlpTag',
    group: 'Signature',
    title: 'Tag',
    description: 'Simple protocol/category tag, active or inactive tone.',
    variants: [
        {
            name: 'default',
            props: {
                label: 'MQTT'
            }
        },
        {
            name: 'active',
            props: {
                label: 'OPC UA',
                active: true
            }
        }
    ],
    snippet: '<AlpTag label="OPC UA" active />',
    sourcePath: 'components/alp/AlpTag.vue'
});
