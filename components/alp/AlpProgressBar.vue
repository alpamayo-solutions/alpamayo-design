<template>
    <div class="rounded-full bg-surface-100 dark:bg-surface-700 overflow-hidden" :class="height">
        <div class="h-full rounded-full transition-all" :class="barColor" :style="`width: ${clamped}%`" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        value: number;
        barColor?: string;
        height?: string;
    }>(),
    {
        barColor: 'bg-primary-500',
        height: 'h-1.5'
    }
);

const clamped = computed(() => Math.max(0, Math.min(100, props.value)));
</script>
