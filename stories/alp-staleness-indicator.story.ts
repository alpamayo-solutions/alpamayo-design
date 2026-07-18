import { defineStory } from './_types';

export default defineStory({
    component: 'AlpStalenessIndicator',
    group: 'Components',
    title: 'Staleness Indicator',
    description:
        'Relative "last updated" time with a refresh button; turns warning-colored past a staleness threshold.',
    variants: [
        {
            name: 'fresh',
            props: {
                lastFetchedAt: new Date(Date.now() - 15_000),
                loading: false
            }
        },
        {
            name: 'stale',
            props: {
                lastFetchedAt: new Date(Date.now() - 5 * 60_000),
                loading: false
            }
        },
        {
            name: 'no-data',
            props: {
                lastFetchedAt: null,
                loading: false
            }
        },
        {
            name: 'loading',
            props: {
                lastFetchedAt: new Date(Date.now() - 15_000),
                loading: true
            }
        }
    ],
    snippet:
        '<AlpStalenessIndicator :last-fetched-at="lastFetchedAt" :loading="loading" @refresh="onRefresh" />',
    sourcePath: 'components/alp/AlpStalenessIndicator.vue'
});
