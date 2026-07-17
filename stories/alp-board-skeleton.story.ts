import { defineStory } from './_types';

export default defineStory({
    component: 'AlpBoardSkeleton',
    group: 'Components',
    title: 'Board Skeleton',
    description:
        'Loading placeholder for a kanban board — one bordered column shell per entry, each stacked with card skeletons.',
    variants: [
        { name: 'default', props: {} },
        { name: 'known-columns', props: { columnNames: ['Backlog', 'Doing', 'Done'], cardsPerColumn: 3 } }
    ],
    snippet: '<AlpBoardSkeleton :columns="4" :cards-per-column="7" />',
    sourcePath: 'components/alp/AlpBoardSkeleton.vue'
});
