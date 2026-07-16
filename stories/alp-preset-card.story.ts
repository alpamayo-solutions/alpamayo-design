import { defineStory } from './_types';

export default defineStory({
    component: 'AlpPresetCard',
    group: 'Signature',
    title: 'Preset Card',
    description: 'Selectable brand-color preset swatch card.',
    variants: [
        {
            name: 'selected',
            props: {
                name: 'Alpamayo Blue',
                primary: '#134562',
                secondary: '#f55632',
                selected: true
            }
        },
        {
            name: 'unselected',
            props: {
                name: 'Slate',
                primary: '#475569',
                secondary: '#94a3b8',
                selected: false
            }
        }
    ],
    snippet: '<AlpPresetCard name="Alpamayo Blue" primary="#134562" secondary="#f55632" :selected="true" />',
    sourcePath: 'components/alp/AlpPresetCard.vue'
});
