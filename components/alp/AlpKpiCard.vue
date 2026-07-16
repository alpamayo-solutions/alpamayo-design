<template>
    <div
        class="bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 px-3 py-2"
    >
        <p
            class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide truncate"
        >
            {{ label }}
        </p>
        <p class="font-bold tabular-nums mt-1 truncate" :class="[valueSize, colorClass]">{{ value }}</p>
        <p class="text-xs mt-0.5 truncate" :class="trendColor ?? 'text-surface-400'">
            <i v-if="trendIcon" :class="trendIcon + ' text-xs'" />
            {{ sub }}
        </p>
    </div>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        label: string;
        value: string;
        sub: string;
        colorClass?: string;
        trendIcon?: string;
        trendColor?: string;
        valueSize?: string;
    }>(),
    {
        colorClass: undefined,
        trendIcon: undefined,
        trendColor: undefined,
        valueSize: 'text-base'
    }
);
</script>
