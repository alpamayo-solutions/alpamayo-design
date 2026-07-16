<template>
    <h3 class="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-4">{{ label }}</h3>
</template>

<script setup lang="ts">
defineProps<{
    label: string;
}>();
</script>
