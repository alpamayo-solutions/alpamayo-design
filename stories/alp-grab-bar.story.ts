import { defineStory } from './_types';

export default defineStory({
    component: 'AlpGrabBar',
    group: 'Components',
    title: 'Grab Bar',
    description: 'Banner listing cards the current user has "grabbed" (claimed) and is actively working on, each releasable individually.',
    variants: [
        {
            name: 'single-grab',
            props: {
                grabs: [{ cardId: 'card-1', title: 'Commission edge-node-04' }]
            }
        },
        {
            name: 'multiple-grabs',
            props: {
                grabs: [
                    { cardId: 'card-1', title: 'Commission edge-node-04' },
                    { cardId: 'card-2', title: 'Retrofit line 4' }
                ]
            }
        },
        {
            name: 'empty',
            props: {
                grabs: []
            }
        }
    ],
    snippet: '<AlpGrabBar :grabs="myGrabs" @release="onRelease" />',
    sourcePath: 'components/alp/AlpGrabBar.vue'
});
