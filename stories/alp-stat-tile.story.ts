import { defineStory } from './_types';

export default defineStory({
    component: 'AlpStatTile',
    group: 'Signature',
    title: 'Stat Tile',
    description: 'Labelled KPI tile with value, sub-line, mono and clickable variants.',
    variants: [
        {
            name: 'default',
            props: {
                label: 'Devices online',
                value: 18,
                sub: 'of 21 total'
            }
        },
        {
            name: 'mono',
            props: {
                label: 'Target revision',
                value: 'a1b2c3d',
                mono: true
            }
        },
        {
            name: 'empty',
            props: {
                label: 'Open incidents'
            }
        }
    ],
    snippet: '<AlpStatTile label="Devices online" :value="18" sub="of 21 total" />',
    sourcePath: 'components/alp/AlpStatTile.vue'
});
