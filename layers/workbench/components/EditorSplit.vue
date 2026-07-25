<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';

export type EditorSplitDirection = 'horizontal' | 'vertical';

const props = defineProps<{
    splitId: string;
    direction: EditorSplitDirection;
    ratio: number;
}>();

const emit = defineEmits<{
    'update:ratio': [ratio: number];
}>();

const splitElement = ref<HTMLElement>();
const MIN_RATIO = 0.2;
const MAX_RATIO = 0.8;
const KEYBOARD_STEP = 0.05;

let pointerStart:
    | {
          coordinate: number;
          ratio: number;
          size: number;
      }
    | undefined;

const clampedRatio = computed(() => clampRatio(props.ratio));
const handleOrientation = computed(() => (props.direction === 'horizontal' ? 'vertical' : 'horizontal'));
const splitStyle = computed(() => ({
    '--alp-workbench-split-ratio': `${clampedRatio.value * 100}%`
}));

function clampRatio(ratio: number) {
    return Math.min(MAX_RATIO, Math.max(MIN_RATIO, ratio));
}

function onKeyboardResize(delta: number) {
    if (delta === 0) return;
    emit('update:ratio', clampRatio(props.ratio + Math.sign(delta) * KEYBOARD_STEP));
}

function pointerCoordinate(event: PointerEvent) {
    return props.direction === 'horizontal' ? event.clientX : event.clientY;
}

function onPointerStart(event: PointerEvent) {
    const bounds = splitElement.value?.getBoundingClientRect();
    const size = props.direction === 'horizontal' ? bounds?.width : bounds?.height;
    if (!size) return;

    pointerStart = {
        coordinate: pointerCoordinate(event),
        ratio: clampedRatio.value,
        size
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', stopPointerResize);
    window.addEventListener('pointercancel', stopPointerResize);
}

function onPointerMove(event: PointerEvent) {
    if (!pointerStart) return;
    const delta = pointerCoordinate(event) - pointerStart.coordinate;
    emit('update:ratio', clampRatio(pointerStart.ratio + delta / pointerStart.size));
}

function stopPointerResize() {
    pointerStart = undefined;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', stopPointerResize);
    window.removeEventListener('pointercancel', stopPointerResize);
}

onBeforeUnmount(stopPointerResize);
</script>

<template>
    <div
        ref="splitElement"
        class="alp-workbench-editor-split"
        :class="`alp-workbench-editor-split--${direction}`"
        :data-split-id="splitId"
        :data-direction="direction"
        data-testid="workbench-editor-split"
        :style="splitStyle"
    >
        <div class="alp-workbench-editor-split-pane alp-workbench-editor-split-pane--first">
            <slot name="first" />
        </div>
        <AlpWorkbenchResizeHandle
            :value="clampedRatio * 100"
            :min="MIN_RATIO * 100"
            :max="MAX_RATIO * 100"
            :step="KEYBOARD_STEP * 100"
            :orientation="handleOrientation"
            :label="`Resize split ${splitId}`"
            @start="onPointerStart"
            @resize="onKeyboardResize"
        />
        <div class="alp-workbench-editor-split-pane alp-workbench-editor-split-pane--second">
            <slot name="second" />
        </div>
    </div>
</template>
