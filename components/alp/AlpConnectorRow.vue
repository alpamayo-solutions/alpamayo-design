<template>
    <div class="flex items-center gap-4 px-5 py-3.5">
        <AlpStatusDot :severity="severity" :animated="pulse" size="w-2.5 h-2.5" />
        <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-surface-800 dark:text-surface-100 truncate">{{ name }}</p>
            <p class="text-xs text-surface-400 truncate">{{ path }}</p>
        </div>
        <span class="text-xs text-surface-400 font-mono">{{ type }}</span>
        <AlpStatusPill :label="status" :severity="severity" />
    </div>
</template>

<script setup lang="ts">
import AlpStatusDot from './AlpStatusDot.vue';
import AlpStatusPill from './AlpStatusPill.vue';

defineProps<{
    name: string;
    path: string;
    type: string;
    status: string;
    severity: 'success' | 'warning' | 'danger' | 'info' | 'help' | 'neutral';
    pulse: boolean;
}>();
</script>
