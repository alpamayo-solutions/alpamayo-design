import { defineStory } from './_types';

export default defineStory({
    component: 'AlpMobilePagination',
    group: 'Components',
    title: 'Mobile Pagination',
    description: 'Compact page-size select + prev/next controls for small-screen list views.',
    variants: [
        {
            name: 'first-page',
            props: {
                page: 1,
                pageSize: 10,
                totalRecords: 42
            }
        },
        {
            name: 'middle-page',
            props: {
                page: 3,
                pageSize: 10,
                totalRecords: 42
            }
        },
        {
            name: 'last-page',
            props: {
                page: 5,
                pageSize: 10,
                totalRecords: 42
            }
        }
    ],
    snippet:
        '<AlpMobilePagination :page="page" :page-size="pageSize" :total-records="total" @page="onPage" />',
    sourcePath: 'components/alp/AlpMobilePagination.vue'
});
