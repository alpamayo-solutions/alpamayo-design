import { defineStory } from './_types';

export default defineStory({
    component: 'VoltChip',
    group: 'Components',
    title: 'Chip',
    description: 'Compact, removable token for tags or filter values.',
    variants: [
        {
            name: 'default',
            props: {
                label: 'MQTT'
            }
        },
        {
            name: 'icon',
            props: {
                label: 'Sensor',
                icon: 'pi pi-wifi'
            }
        },
        {
            name: 'removable',
            props: {
                label: 'Line 4 retrofit',
                removable: true
            }
        }
    ],
    snippet: '<VoltChip label="MQTT" removable />',
    sourcePath: 'components/volt/Chip.vue'
});
