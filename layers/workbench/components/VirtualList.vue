<script setup lang="ts" generic="T">
import { computed, onMounted, ref } from 'vue';

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

onMounted(measure);

const startIndex = computed(() =>
    Math.max(0, Math.floor(scrollTop.value / props.rowHeight) - props.overscan)
);
const endIndex = computed(() => {
    // Before the first measurement viewportHeight is 0; render a screenful
    // rather than nothing, so a list mounted inside a collapsed-then-expanded
    // section is never blank while waiting for a scroll event.
    const visibleRows = Math.ceil((viewportHeight.value || 320) / props.rowHeight);
    return Math.min(props.items.length, startIndex.value + visibleRows + props.overscan * 2);
});
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
