<script setup lang="ts">
import { nextTick, ref } from 'vue';

/** A secondary action offered on one tab, beside its close button. */
export interface WorkbenchTabAction {
    id: string;
    /** Icon class, e.g. `pi pi-external-link`. */
    icon: string;
    /** The accessible name AND the tooltip. Already translated by the caller:
     *  this package ships no strings of its own. */
    label: string;
}

export interface WorkbenchTab {
    id: string;
    label: string;
    icon?: string;
    preview?: boolean;
    dirty?: boolean;
    /**
     * Actions belonging to THIS tab, rendered to the left of its close
     * button. The strip knows nothing about what they do — it renders what it
     * is given and emits `action` with the tab and the action id.
     *
     * This exists so a consumer can put a tab-scoped control in the tab
     * chrome rather than floating one over the tab's CONTENT, where it
     * overlaps whatever the content happens to draw in that corner.
     */
    actions?: WorkbenchTabAction[];
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
    pin: [id: string];
    close: [id: string];
    action: [tabId: string, actionId: string];
    'drag-start': [tabId: string, event: DragEvent];
    'drop-tab': [beforeTabId: string | undefined, event: DragEvent];
    'drag-end': [event: DragEvent];
}>();

const draggingId = ref<string>();

function onTabKeydown(id: string, event: KeyboardEvent): void {
    if (event.defaultPrevented || event.isComposing || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'Tab' && event.shiftKey && props.tabs.length < 2) return;
    const index = props.tabs.findIndex((tab) => tab.id === id);
    const strip = (event.currentTarget as HTMLElement).closest('.alp-workbench-tab-strip');
    let next: number;
    if (event.key === 'ArrowLeft' || (event.key === 'Tab' && event.shiftKey))
        next = (index - 1 + props.tabs.length) % props.tabs.length;
    else if (event.key === 'ArrowRight') next = (index + 1) % props.tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = props.tabs.length - 1;
    else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        emit('select', id);
        return;
    } else if (event.key === 'Delete') {
        event.preventDefault();
        event.stopPropagation();
        emit('close', id);
        void nextTick(() => {
            const tabs = strip?.querySelectorAll<HTMLElement>('[data-testid="workbench-tab"]');
            tabs?.[Math.min(index, tabs.length - 1)]?.focus();
        });
        return;
    } else return;
    event.preventDefault();
    event.stopPropagation();
    const tab = props.tabs[next];
    if (!tab) return;
    emit('select', tab.id);
    const element = strip?.querySelectorAll<HTMLElement>('[data-testid="workbench-tab"]')[next];
    element?.focus();
    element?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
}

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
            <div
                v-for="tab in tabs"
                :key="tab.id"
                class="alp-workbench-tab-frame"
                :class="{
                    'alp-workbench-tab--active': tab.id === activeId,
                    'alp-workbench-tab--preview': tab.preview,
                    'alp-workbench-tab--dirty': tab.dirty,
                    'alp-workbench-tab--dragging': tab.id === draggingId
                }"
                @dragover.prevent
                @drop="onDropTab(tab.id, $event)"
            >
                <VoltTab
                    :value="tab.id"
                    class="alp-workbench-tab"
                    data-testid="workbench-tab"
                    :draggable="draggable"
                    @click="$emit('select', tab.id)"
                    @keydown.capture="onTabKeydown(tab.id, $event)"
                    @dblclick="$emit('pin', tab.id)"
                    @dragstart="onDragStart(tab.id, $event)"
                    @dragend="onDragEnd"
                >
                    <i v-if="tab.icon" :class="tab.icon" aria-hidden="true" />
                    <span class="alp-workbench-tab-label">{{ tab.label }}</span>
                    <span v-if="tab.dirty" class="alp-workbench-tab-dirty" aria-label="Unsaved changes" />
                </VoltTab>
                <button
                    v-for="action in tab.actions ?? []"
                    :key="action.id"
                    type="button"
                    :aria-label="action.label"
                    :title="action.label"
                    :data-tab-action="action.id"
                    class="alp-workbench-tab-action"
                    :class="action.icon"
                    @click.stop="$emit('action', tab.id, action.id)"
                />
                <button
                    type="button"
                    :aria-label="`Close ${tab.label}`"
                    class="alp-workbench-tab-close pi pi-times"
                    @click="$emit('close', tab.id)"
                />
            </div>
        </VoltTabList>
    </VoltTabs>
</template>
