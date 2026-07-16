import { defineStory } from './_types';

export default defineStory({
    component: 'AlpBeltLifeRow',
    group: 'Signature',
    title: 'Belt Life Row',
    description: 'Sanding belt remaining-life row — color shifts by remaining % threshold.',
    variants: [
        {
            name: 'healthy',
            props: {
                station: 'Sander 1',
                remaining: 82,
                grit: 'P80',
                type: 'Ceramic',
                used: '90h'
            }
        },
        {
            name: 'warning',
            props: {
                station: 'Sander 2',
                remaining: 35,
                grit: 'P120',
                type: 'Zirconia',
                used: '210h'
            }
        },
        {
            name: 'critical',
            props: {
                station: 'Sander 3',
                remaining: 12,
                grit: 'P150',
                type: 'Ceramic',
                used: '340h'
            }
        }
    ],
    snippet: '<AlpBeltLifeRow station="Sander 2" :remaining="35" grit="P120" type="Zirconia" used="210h" />',
    sourcePath: 'components/alp/AlpBeltLifeRow.vue'
});
