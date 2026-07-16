<template>
    <div class="flex items-start gap-4 px-5 py-3.5">
        <AlpStatusDot :severity="severity" size="w-2 h-2" class="mt-1.5" />
        <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
                <p class="text-sm font-medium text-surface-800 dark:text-surface-100">{{ message }}</p>
                <span class="text-xs text-surface-400 shrink-0">{{ time }}</span>
            </div>
            <p class="text-xs text-surface-400 mt-0.5 sensitive">{{ node }} · {{ org }}</p>
        </div>
        <AlpStatusPill :label="severityLabel" :severity="severity" class="shrink-0" />
    </div>
</template>

<script setup lang="ts">
import AlpStatusDot from './AlpStatusDot.vue';
import AlpStatusPill from './AlpStatusPill.vue';

type Severity = 'success' | 'warning' | 'danger' | 'info' | 'help' | 'neutral';

defineProps<{
    message: string;
    node: string;
    org: string;
    severity: Severity;
    severityLabel: string;
    time: string;
}>();
</script>
