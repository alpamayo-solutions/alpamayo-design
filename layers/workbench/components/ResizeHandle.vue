<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        value: number;
        label?: string;
        min?: number;
        max?: number;
        step?: number;
    }>(),
    {
        label: 'Resize panel',
        min: 0,
        max: 1000,
        step: 16
    }
);

const emit = defineEmits<{
    start: [event: PointerEvent];
    resize: [delta: number];
}>();

function onKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        emit('resize', -props.step);
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        emit('resize', props.step);
    }
}
</script>

<template>
    <div
        class="alp-workbench-resize-handle"
        role="separator"
        tabindex="0"
        :aria-label="label"
        aria-orientation="vertical"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="value"
        @pointerdown.prevent="$emit('start', $event)"
        @keydown="onKeydown"
    />
</template>
