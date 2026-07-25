<script setup lang="ts">
import { ref } from 'vue';

export interface WorkbenchTab {
    id: string;
    label: string;
    icon?: string;
    preview?: boolean;
    dirty?: boolean;
}

const props = withDefaults(
    defineProps<{
        activeId?: string;
        tabs: WorkbenchTab[];
        draggable?: boolean;
    }>(),
    {
        activeId: undefined,
        draggable: false
    }
);

const emit = defineEmits<{
    select: [id: string];
    close: [id: string];
    'drag-start': [tabId: string, event: DragEvent];
    'drop-tab': [beforeTabId: string | undefined, event: DragEvent];
    'drag-end': [event: DragEvent];
}>();

const draggingId = ref<string>();

function onDragStart(tabId: string, event: DragEvent) {
    if (!props.draggable) return;
    draggingId.value = tabId;
    emit('drag-start', tabId, event);
}

function onDropTab(beforeTabId: string, event: DragEvent) {
    if (!props.draggable) return;
    event.preventDefault();
    event.stopPropagation();
    emit('drop-tab', beforeTabId, event);
}

function onDropStrip(event: DragEvent) {
    if (!props.draggable) return;
    event.preventDefault();
    emit('drop-tab', undefined, event);
}

function onDragEnd(event: DragEvent) {
    if (!props.draggable) return;
    draggingId.value = undefined;
    emit('drag-end', event);
}
</script>

<template>
    <VoltTabs
        :value="activeId ?? ''"
        class="alp-workbench-tab-strip"
        :class="{ 'alp-workbench-tab-strip--dragging': draggingId }"
        @dragover.prevent
        @drop="onDropStrip"
    >
        <VoltTabList>
            <VoltTab
                v-for="tab in tabs"
                :key="tab.id"
                :value="tab.id"
                class="alp-workbench-tab"
                :class="{
                    'alp-workbench-tab--active': tab.id === activeId,
                    'alp-workbench-tab--preview': tab.preview,
                    'alp-workbench-tab--dirty': tab.dirty,
                    'alp-workbench-tab--dragging': tab.id === draggingId
                }"
                data-testid="workbench-tab"
                :draggable="draggable"
                @click="$emit('select', tab.id)"
                @dragstart="onDragStart(tab.id, $event)"
                @dragover.prevent
                @drop="onDropTab(tab.id, $event)"
                @dragend="onDragEnd"
            >
                <i v-if="tab.icon" :class="tab.icon" aria-hidden="true" />
                <span class="alp-workbench-tab-label">{{ tab.label }}</span>
                <span v-if="tab.dirty" class="alp-workbench-tab-dirty" aria-label="Unsaved changes" />
                <span
                    role="button"
                    tabindex="0"
                    :aria-label="`Close ${tab.label}`"
                    class="alp-workbench-tab-close pi pi-times"
                    @click.stop="$emit('close', tab.id)"
                    @keydown.enter.stop="$emit('close', tab.id)"
                    @keydown.space.prevent.stop="$emit('close', tab.id)"
                />
            </VoltTab>
        </VoltTabList>
    </VoltTabs>
</template>
