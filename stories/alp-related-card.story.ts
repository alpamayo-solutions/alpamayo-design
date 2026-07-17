import { defineStory } from './_types';

export default defineStory({
    component: 'AlpRelatedCard',
    group: 'Components',
    title: 'Related Card',
    description: 'Card shell (title + count + pagination) around a list of related records.',
    variants: [
        {
            name: 'default',
            props: {
                title: 'Related devices',
                count: 3,
                page: 1,
                pageSize: 10
            },
            slots: {
                default:
                    '<ul class="divide-y divide-surface-100 dark:divide-surface-700"><li class="px-5 py-2 text-sm">edge-node-01</li><li class="px-5 py-2 text-sm">edge-node-02</li><li class="px-5 py-2 text-sm">edge-node-03</li></ul>'
            }
        },
        {
            name: 'loading',
            props: {
                title: 'Related devices',
                count: 0,
                page: 1,
                pageSize: 10,
                loading: true
            }
        },
        {
            name: 'empty',
            props: {
                title: 'Related devices',
                count: 0,
                page: 1,
                pageSize: 10
            }
        },
        {
            name: 'paginated',
            props: {
                title: 'Related devices',
                count: 42,
                page: 2,
                pageSize: 10
            },
            slots: {
                default: '<p class="px-5 py-3 text-sm">Page 2 of records.</p>'
            }
        }
    ],
    snippet: '<AlpRelatedCard title="Related devices" :count="42" :page="page" :page-size="10" @page="onPage" />',
    sourcePath: 'components/alp/AlpRelatedCard.vue'
});
