<template>
    <div>
        <div class="flex justify-between text-xs mb-1">
            <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full shrink-0" :class="dot" />
                <span class="text-surface-700 dark:text-surface-200">{{ label }}</span>
            </div>
            <span class="font-bold text-surface-800 dark:text-surface-100">{{ count }}</span>
        </div>
        <div class="h-1.5 rounded-full bg-surface-100 dark:bg-surface-700 overflow-hidden">
            <div class="h-full rounded-full" :class="bar" :style="`width: ${(count / total) * 100}%`" />
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    label: string;
    count: number;
    total: number;
    dot: string;
    bar: string;
}>();
</script>
