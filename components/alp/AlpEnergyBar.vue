<template>
    <div>
        <div class="flex justify-between text-xs mb-1">
            <span class="text-surface-600 dark:text-surface-300">{{ name }}</span>
            <span class="font-semibold" :class="textColor">{{ kw }} kW</span>
        </div>
        <div class="h-2 rounded-full bg-surface-100 dark:bg-surface-700 overflow-hidden">
            <div
                class="h-full rounded-full transition-all"
                :class="barColor"
                :style="`width: ${(kw / max) * 100}%`"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        name: string;
        kw: number;
        max?: number;
    }>(),
    {
        max: 100
    }
);

const barColor = computed(() => {
    const pct = props.kw / props.max;
    if (pct >= 0.75) return 'bg-danger-500';
    if (pct >= 0.5) return 'bg-warning-400';
    if (pct >= 0.25) return 'bg-info-400';
    return 'bg-success-500';
});

const textColor = computed(() => {
    const pct = props.kw / props.max;
    if (pct >= 0.75) return 'text-danger-600 dark:text-danger-400';
    if (pct >= 0.5) return 'text-warning-600 dark:text-warning-400';
    if (pct >= 0.25) return 'text-info-600 dark:text-info-400';
    return 'text-success-600 dark:text-success-400';
});
</script>
