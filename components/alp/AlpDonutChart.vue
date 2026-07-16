<template>
    <div
        class="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4"
    >
        <p class="text-xs font-semibold text-surface-700 dark:text-surface-200 mb-0.5">{{ title }}</p>
        <p class="text-2xl font-bold text-success-600 mb-3">{{ value }}</p>
        <div class="flex items-center gap-3">
            <svg viewBox="0 0 40 40" class="w-10 h-10 shrink-0">
                <circle cx="20" cy="20" r="15" fill="none" stroke="var(--success-100)" stroke-width="8" />
                <circle
                    cx="20"
                    cy="20"
                    r="15"
                    fill="none"
                    stroke="var(--success-500)"
                    stroke-width="8"
                    stroke-dasharray="75.4 94.2"
                    stroke-dashoffset="23.6"
                    stroke-linecap="round"
                />
            </svg>
            <div class="space-y-0.5 text-xs">
                <div v-for="item in items" :key="item.label" class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full inline-block" :class="item.dotClass" />
                    {{ item.label }} — {{ item.count }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
    value: string;
    items: { label: string; count: number; color: string; dotClass: string }[];
}>();
</script>
