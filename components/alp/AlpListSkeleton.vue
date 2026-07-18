<script setup lang="ts">
withDefaults(
    defineProps<{
        /** Number of placeholder rows to render. */
        rows?: number;
    }>(),
    { rows: 12 }
);
</script>

<template>
    <div class="flex-1 min-h-0 flex flex-col px-4 sm:px-6 pb-4">
        <div
            class="flex-1 min-h-0 flex flex-col bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden"
        >
            <!-- Header row -->
            <div
                class="flex items-center gap-4 px-4 py-3 border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/40"
            >
                <VoltSkeleton width="40%" height="0.75rem" border-radius="0.25rem" />
                <VoltSkeleton width="6rem" height="0.75rem" border-radius="0.25rem" class="ml-auto" />
                <VoltSkeleton width="5rem" height="0.75rem" border-radius="0.25rem" />
                <VoltSkeleton width="4rem" height="0.75rem" border-radius="0.25rem" />
            </div>
            <!-- Body rows -->
            <div
                v-for="row in rows"
                :key="row"
                data-testid="list-skeleton-row"
                class="flex items-center gap-4 px-4 py-3 border-b border-surface-100 dark:border-surface-800 last:border-b-0"
            >
                <!-- Task title cell: icon dot + text bar -->
                <div class="flex items-center gap-2 min-w-0" style="width: 40%">
                    <VoltSkeleton shape="circle" width="1.25rem" height="1.25rem" />
                    <VoltSkeleton
                        :width="`${60 + ((row * 7) % 30)}%`"
                        height="0.9rem"
                        border-radius="0.25rem"
                    />
                </div>
                <!-- assignee -->
                <VoltSkeleton shape="circle" width="1.5rem" height="1.5rem" class="ml-auto" />
                <!-- status pill -->
                <VoltSkeleton width="5rem" height="1.25rem" border-radius="9999px" />
                <!-- date -->
                <VoltSkeleton width="4rem" height="0.9rem" border-radius="0.25rem" />
            </div>
        </div>
    </div>
</template>
