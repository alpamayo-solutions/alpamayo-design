<template>
    <span class="inline-flex items-center text-xs px-2 py-0.5 rounded transition-colors" :class="toneClass">
        <slot>{{ label }}</slot>
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        label?: string;
        active?: boolean;
    }>(),
    { label: undefined, active: false }
);

const toneClass = computed(() =>
    props.active
        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
        : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300'
);
</script>
