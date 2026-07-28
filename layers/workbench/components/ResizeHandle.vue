<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        value: number;
        label?: string;
        min?: number;
        max?: number;
        step?: number;
        orientation?: 'vertical' | 'horizontal';
    }>(),
    {
        label: 'Resize panel',
        min: 0,
        max: 1000,
        step: 16,
        orientation: 'vertical'
    }
);

const emit = defineEmits<{
    start: [event: PointerEvent];
    resize: [delta: number];
}>();

function onKeydown(event: KeyboardEvent) {
    const decrementKey = props.orientation === 'vertical' ? 'ArrowLeft' : 'ArrowUp';
    const incrementKey = props.orientation === 'vertical' ? 'ArrowRight' : 'ArrowDown';

    if (event.key === decrementKey) {
        event.preventDefault();
        emit('resize', -props.step);
    }
    if (event.key === incrementKey) {
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
        :aria-orientation="orientation"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="value"
        @pointerdown.prevent="$emit('start', $event)"
        @keydown="onKeydown"
    />
</template>
