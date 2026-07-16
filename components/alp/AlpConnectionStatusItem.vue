<template>
    <div class="flex items-center gap-3">
        <AlpStatusDot :severity="severity" :animated="pulse" size="w-3 h-3" />
        <div>
            <p class="text-sm font-medium text-surface-800 dark:text-surface-100">{{ label }}</p>
            <p class="text-xs text-surface-400">{{ sub }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import AlpStatusDot from './AlpStatusDot.vue';

defineProps<{
    label: string;
    sub: string;
    pulse: boolean;
    severity: 'success' | 'warning' | 'danger' | 'info' | 'help' | 'neutral';
}>();
</script>
