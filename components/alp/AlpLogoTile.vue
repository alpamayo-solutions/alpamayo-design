<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    integration?: string | null;
    label?: string | null;
}>();

const slug = computed(() => (props.integration || '').trim().toLowerCase());
const labelText = computed(() => props.label || slug.value || 'Integration');
</script>

<template>
    <span
        class="inline-flex h-5 w-5 items-center justify-center rounded border border-surface-200 bg-white text-xs font-semibold text-surface-500 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-300"
        :title="labelText"
        :aria-label="labelText"
    >
        <span>{{ labelText.slice(0, 1).toUpperCase() }}</span>
    </span>
</template>
