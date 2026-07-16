<template>
    <p class="text-xs font-semibold text-surface-500 uppercase tracking-wider">
        <slot>{{ label }}</slot>
    </p>
</template>

<script setup lang="ts">
defineProps<{
    label?: string;
}>();
</script>
