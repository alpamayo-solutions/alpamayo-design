<template>
    <div>
        <div class="flex justify-between text-xs text-surface-600 dark:text-surface-300 mb-1.5">
            <span class="font-medium">{{ label }}</span>
            <span v-if="showValue" class="font-bold" :class="color">{{ value }}{{ suffix }}</span>
        </div>
        <AlpProgressBar :value="value" :bar-color="barColor" height="h-2" />
    </div>
</template>

<script setup lang="ts">
import AlpProgressBar from './AlpProgressBar.vue';

withDefaults(
    defineProps<{
        label: string;
        value: number;
        barColor: string;
        color?: string;
        suffix?: string;
        showValue?: boolean;
    }>(),
    {
        color: undefined,
        suffix: '%',
        showValue: true
    }
);
</script>
