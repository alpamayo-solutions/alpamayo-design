import { defineStory } from './_types';

export default defineStory({
    component: 'AlpEnergyBar',
    group: 'Signature',
    title: 'Energy Bar',
    description: 'Power draw bar for a machine, colored by load threshold.',
    variants: [
        {
            name: 'low',
            props: {
                name: 'Sander 1',
                kw: 8,
                max: 40
            }
        },
        {
            name: 'mid',
            props: {
                name: 'Sander 2',
                kw: 22,
                max: 40
            }
        },
        {
            name: 'high',
            props: {
                name: 'Sander 3',
                kw: 36,
                max: 40
            }
        }
    ],
    snippet: '<AlpEnergyBar name="Sander 2" :kw="22" :max="40" />',
    sourcePath: 'components/alp/AlpEnergyBar.vue'
});
