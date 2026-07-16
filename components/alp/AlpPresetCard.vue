<template>
    <VoltButton
        type="button"
        severity="secondary"
        outlined
        :class="[
            '!flex !h-auto !w-full !items-center !justify-start !gap-2 !rounded-lg !px-2.5 !py-2 !text-left',
            selected
                ? 'border-primary-400 bg-primary-100 dark:bg-primary-900/20 ring-1 ring-primary-400'
                : 'border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 hover:border-primary-300 dark:hover:border-primary-600'
        ]"
    >
        <div class="flex shrink-0 -space-x-1.5">
            <span
                class="w-5 h-5 rounded-full border-2 border-white dark:border-surface-800"
                :style="{ background: primary }"
            />
            <span
                class="w-5 h-5 rounded-full border-2 border-white dark:border-surface-800"
                :style="{ background: secondary }"
            />
        </div>
        <span class="text-xs font-medium text-surface-700 dark:text-surface-200 truncate leading-tight">{{
            name
        }}</span>
    </VoltButton>
</template>

<script setup lang="ts">
defineProps<{
    name: string;
    primary: string;
    secondary: string;
    selected: boolean;
}>();
</script>
