<script setup lang="ts">
interface Item {
    label: string;
    value?: string;
    mono?: boolean;
    sensitive?: boolean;
}

defineProps<{ items: Item[] }>();
</script>

<template>
    <div
        class="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 px-5 py-4 grid grid-cols-2 md:grid-cols-3 gap-4"
    >
        <div v-for="(item, idx) in items" :key="idx" class="min-w-0">
            <p class="text-xs uppercase tracking-wide text-surface-500 dark:text-surface-400 font-semibold">
                {{ item.label }}
            </p>
            <p
                class="text-sm text-surface-800 dark:text-surface-100 mt-1 truncate"
                :class="[item.mono && 'font-mono', item.sensitive && 'sensitive']"
            >
                {{ item.value || '—' }}
            </p>
        </div>
    </div>
</template>
