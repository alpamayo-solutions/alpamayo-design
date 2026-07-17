import { defineStory } from './_types';

export default defineStory({
    component: 'AlpLogoTile',
    group: 'Components',
    title: 'Logo Tile',
    description: 'Small square initial tile for an integration/vendor name — pure-props presentational fallback until a real logo asset is wired up.',
    variants: [
        {
            name: 'with-label',
            props: {
                integration: 'github',
                label: 'GitHub'
            }
        },
        {
            name: 'slug-only',
            props: {
                integration: 'azure-devops'
            }
        },
        {
            name: 'unknown',
            props: {}
        }
    ],
    snippet: '<AlpLogoTile integration="github" label="GitHub" />',
    sourcePath: 'components/alp/AlpLogoTile.vue'
});
