<script setup lang="ts" generic="T">
import { computed, onMounted, onUnmounted, ref } from 'vue';

const props = withDefaults(
    defineProps<{
        items: readonly T[];
        /** Every row must be exactly this tall; the CSS below enforces it. */
        rowHeight: number;
        overscan?: number;
    }>(),
    { overscan: 4 }
);

const viewport = ref<HTMLElement>();
const scrollTop = ref(0);
const viewportHeight = ref(0);

function measure(): void {
    const element = viewport.value;
    if (!element) return;
    scrollTop.value = element.scrollTop;
    viewportHeight.value = element.clientHeight;
}

let resizeObserver: ResizeObserver | undefined;

onMounted(() => {
    measure();
    // The viewport can grow or shrink with no intervening scroll event -- e.g. a sibling
    // sidebar section collapses and this section's share of the height grows. Without this,
    // viewportHeight keeps its stale value and the window under-renders until the user
    // happens to scroll.
    if (viewport.value) {
        resizeObserver = new ResizeObserver(measure);
        resizeObserver.observe(viewport.value);
    }
});

onUnmounted(() => {
    resizeObserver?.disconnect();
});

const visibleRows = computed(() => {
    // Before the first measurement viewportHeight is 0; render a screenful
    // rather than nothing, so a list mounted inside a collapsed-then-expanded
    // section is never blank while waiting for a scroll or resize event.
    return Math.ceil((viewportHeight.value || 320) / props.rowHeight);
});

/**
 * The highest startIndex that still leaves the viewport full, given the current item count.
 * Re-clamping against items.length (not just against 0) matters when items shrinks without an
 * accompanying scroll reset: a stale scrollTop could otherwise place startIndex past the end
 * of the new, shorter array. Array.prototype.slice clamps an out-of-range start to the array's
 * length before comparing it with end, so slice(startIndex, endIndex) would silently return []
 * instead of a valid window -- a blank list with no error.
 */
const maxStartIndex = computed(() => Math.max(0, props.items.length - visibleRows.value));

const startIndex = computed(() => {
    const requested = Math.floor(scrollTop.value / props.rowHeight) - props.overscan;
    return Math.min(Math.max(0, requested), maxStartIndex.value);
});
const endIndex = computed(() =>
    Math.min(props.items.length, startIndex.value + visibleRows.value + props.overscan * 2)
);
const windowed = computed(() =>
    props.items.slice(startIndex.value, endIndex.value).map((item, offset) => ({
        item,
        index: startIndex.value + offset
    }))
);
</script>

<template>
    <div ref="viewport" class="alp-workbench-virtual-list" @scroll="measure">
        <div
            class="alp-workbench-virtual-list-spacer"
            :style="{ height: `${props.items.length * props.rowHeight}px` }"
        >
            <div
                class="alp-workbench-virtual-list-window"
                :style="{ transform: `translateY(${startIndex * props.rowHeight}px)` }"
            >
                <div
                    v-for="entry in windowed"
                    :key="entry.index"
                    class="alp-workbench-virtual-list-row"
                    :style="{ height: `${props.rowHeight}px` }"
                >
                    <slot :item="entry.item" :index="entry.index" />
                </div>
            </div>
        </div>
    </div>
</template>
