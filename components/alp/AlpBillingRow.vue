<template>
    <div class="flex items-center gap-3 px-5 py-3">
        <AlpStatusPill :label="status" :severity="severity" />
        <span class="flex-1 text-sm text-surface-700 dark:text-surface-200 sensitive">{{ name }}</span>
        <span class="text-sm font-semibold text-surface-800 dark:text-surface-100">{{ amount }}</span>
    </div>
</template>

<script setup lang="ts">
import AlpStatusPill from './AlpStatusPill.vue';

defineProps<{
    status: string;
    severity: 'success' | 'warning' | 'danger' | 'info' | 'help' | 'neutral';
    name: string;
    amount: string;
}>();
</script>
