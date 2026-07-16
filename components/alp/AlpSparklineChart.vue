<template>
    <div
        class="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4"
    >
        <p class="text-xs font-semibold text-surface-700 dark:text-surface-200 mb-0.5">{{ title }}</p>
        <p class="text-2xl font-bold mb-3" :style="{ color: color }">{{ value }}</p>
        <svg viewBox="0 0 160 40" class="w-full h-10" preserveAspectRatio="none">
            <defs>
                <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" :stop-color="gradientColor" stop-opacity="0.3" />
                    <stop offset="100%" :stop-color="gradientColor" stop-opacity="0" />
                </linearGradient>
            </defs>
            <path :d="path" fill="none" :stroke="color" stroke-width="2" stroke-linecap="round" />
            <path :d="path + ' L160,40 L0,40Z'" :fill="`url(#${gradientId})`" />
        </svg>
    </div>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        title: string;
        value: string;
        path: string;
        gradientId: string;
        color?: string;
        gradientColor?: string;
    }>(),
    {
        color: 'var(--primary-500)',
        gradientColor: 'var(--primary-400)'
    }
);
</script>
