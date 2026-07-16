<template>
    <div>
        <div class="flex justify-between text-xs text-surface-500 mb-1">
            <span class="font-medium text-surface-700 dark:text-surface-200">{{ station }}</span>
            <span :class="textClass">{{ remaining }}% remaining</span>
        </div>
        <AlpProgressBar :value="remaining" :bar-color="barColor" height="h-2" />
        <div class="flex justify-between text-xs text-surface-400 mt-0.5">
            <span>{{ grit }} · {{ type }}</span>
            <span>{{ used }}m used</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AlpProgressBar from './AlpProgressBar.vue';

const props = defineProps<{
    station: string;
    remaining: number;
    grit: string;
    type: string;
    used: string;
}>();

const textClass = computed(() => {
    if (props.remaining < 20) return 'text-danger-500 font-medium';
    if (props.remaining < 40) return 'text-warning-500';
    return 'text-success-600 dark:text-success-400';
});

const barColor = computed(() => {
    if (props.remaining < 20) return 'bg-danger-500';
    if (props.remaining < 40) return 'bg-warning-400';
    return 'bg-success-500';
});
</script>
