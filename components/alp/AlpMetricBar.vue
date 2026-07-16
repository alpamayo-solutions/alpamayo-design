<template>
    <div v-if="variant === 'block'">
        <div class="flex justify-between text-xs text-surface-600 dark:text-surface-300 mb-1.5">
            <span class="font-medium">{{ label }}</span>
            <span v-if="showValue && value !== null" class="font-bold" :class="color"
                >{{ Math.round(value) }}{{ suffix }}</span
            >
        </div>
        <AlpProgressBar :value="value ?? 0" :bar-color="resolvedBarColor" height="h-2" />
    </div>
    <div v-else class="flex items-center gap-1.5 min-w-[80px]">
        <span v-if="label" class="text-xs text-surface-400 w-7 shrink-0">{{ label }}</span>
        <div v-if="value !== null" class="flex items-center gap-1.5 flex-1">
            <div class="h-1.5 flex-1 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
                <div
                    class="h-full rounded-full transition-all duration-500"
                    :class="resolvedBarColor"
                    :style="{ width: inlineWidth }"
                />
            </div>
            <span
                v-if="showValue"
                class="text-xs text-surface-500 dark:text-surface-400 w-7 text-right tabular-nums"
                >{{ Math.round(value) }}{{ suffix }}</span
            >
        </div>
        <span v-else class="text-xs text-surface-400">—</span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AlpProgressBar from './AlpProgressBar.vue';

const props = withDefaults(
    defineProps<{
        /** 0–100, or null for "no data" (inline variant renders an em dash) */
        value: number | null;
        label?: string;
        variant?: 'block' | 'inline';
        /** explicit tailwind bg class; wins over autoColor */
        barColor?: string;
        /** text color class for the block-variant value */
        color?: string;
        suffix?: string;
        showValue?: boolean;
        /** color by threshold: >90 danger, >75 warning, else success */
        autoColor?: boolean;
        /** if true, LOW values are bad (e.g. idle %) */
        invertThreshold?: boolean;
    }>(),
    {
        label: undefined,
        variant: 'block',
        barColor: undefined,
        color: undefined,
        suffix: '%',
        showValue: true,
        autoColor: false,
        invertThreshold: false
    }
);

const badness = computed(() => {
    if (props.value === null) return 0;
    return props.invertThreshold ? 100 - props.value : props.value;
});

const resolvedBarColor = computed(() => {
    if (props.barColor) return props.barColor;
    if (!props.autoColor || props.value === null) return 'bg-primary-500';
    if (badness.value > 90) return 'bg-danger-500';
    if (badness.value > 75) return 'bg-warning-500';
    return 'bg-success-500';
});

const inlineWidth = computed(() => {
    if (props.value === null) return '0%';
    const display = props.invertThreshold ? 100 - props.value : props.value;
    return `${Math.max(0, Math.min(100, Math.round(display)))}%`;
});
</script>
