<script setup lang="ts">
withDefaults(defineProps<{ showTag?: boolean }>(), { showTag: true });
</script>

<template>
    <div
        data-testid="card-skeleton"
        class="flex flex-col gap-2 p-3 rounded-md border border-surface-200 dark:border-surface-700"
    >
        <VoltSkeleton data-testid="card-skeleton-title" width="80%" height="1rem" border-radius="0.25rem" />
        <VoltSkeleton
            data-testid="card-skeleton-subtitle"
            width="40%"
            height="0.75rem"
            border-radius="0.25rem"
        />
        <div class="mt-1 flex items-center gap-2">
            <VoltSkeleton
                data-testid="card-skeleton-avatar"
                shape="circle"
                width="1.25rem"
                height="1.25rem"
            />
            <VoltSkeleton
                v-if="showTag"
                data-testid="card-skeleton-tag"
                width="3rem"
                height="1rem"
                border-radius="9999px"
            />
        </div>
    </div>
</template>
