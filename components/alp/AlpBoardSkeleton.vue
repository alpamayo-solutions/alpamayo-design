<script setup lang="ts">
import { computed } from 'vue';
import AlpCardSkeleton from './AlpCardSkeleton.vue';

const props = withDefaults(
    defineProps<{
        columns?: number;
        cardsPerColumn?: number;
        /** Real column names, when already known from a stale/expired cache —
         * makes the skeleton match the actual board column-by-column instead
         * of a generic placeholder shape. Falls back to `columns` when empty. */
        columnNames?: string[];
    }>(),
    { columns: 4, cardsPerColumn: 7, columnNames: () => [] }
);

const displayColumns = computed<Array<string | number>>(() =>
    props.columnNames?.length ? props.columnNames : Array.from({ length: props.columns }, (_, i) => i)
);
</script>

<template>
    <div class="flex h-full min-h-[400px] gap-4 overflow-x-auto p-4 sm:px-6">
        <!-- Each skeleton column mirrors a real BoardColumn: rounded-xl bordered
             shell, a bg-surface-0 header (status dot + title + count badge) with
             a bottom border, then the card list. -->
        <div
            v-for="(col, idx) in displayColumns"
            :key="typeof col === 'string' ? col : idx"
            data-testid="board-skeleton-column"
            class="flex max-h-full w-72 min-w-[272px] shrink-0 flex-col rounded-xl border border-surface-100 bg-surface-50/60 dark:border-surface-800 dark:bg-surface-900/40"
        >
            <!-- Header -->
            <div
                class="flex items-center gap-2 rounded-t-xl border-b border-surface-200 bg-surface-0 px-3 py-1.5 dark:border-surface-700 dark:bg-surface-900"
            >
                <VoltSkeleton shape="circle" width="1rem" height="1rem" />
                <!-- Pure skeleton: always a bar for the title, never the real column
                     name — known names still drive the column COUNT (displayColumns)
                     so the shape matches, but the loading state stays text-free. -->
                <VoltSkeleton width="5rem" height="0.8rem" border-radius="0.25rem" />
                <VoltSkeleton width="1.25rem" height="1rem" border-radius="9999px" />
            </div>
            <!-- Card list -->
            <div class="flex flex-col gap-2 p-2">
                <AlpCardSkeleton v-for="card in cardsPerColumn" :key="card" />
            </div>
        </div>
    </div>
</template>
