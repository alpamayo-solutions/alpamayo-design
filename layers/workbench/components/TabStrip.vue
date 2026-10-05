<script setup lang="ts">
import { computed, nextTick, ref, useId } from 'vue';

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
        /** Accessible name of the tab list. Already translated by the caller. */
        label?: string;
        /**
         * Prefix for the tabs' element ids, so a consumer can point at them
         * (an editor group labels its panel with the active tab).
         */
        idPrefix?: string;
        /** Id of the element showing the active tab's content, if any. */
        panelId?: string;
    }>(),
    {
        activeId: undefined,
        draggable: false,
        label: undefined,
        idPrefix: undefined,
        panelId: undefined
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

const generatedId = useId();
/** Element id of the tab at `index`. Tab ids are caller data and may contain
 *  whitespace, so they never go into an id reference directly. */
function tabElementId(index: number): string {
    return `${props.idPrefix ?? generatedId}-tab-${index}`;
}

/**
 * The tab list owns the tabs through `aria-owns` rather than as DOM children.
 * Each tab sits in a frame next to its action and close buttons; were the frames
 * inside the `tablist`, those buttons would be children of the list, which only
 * allows tabs. This way the tabs form the list and the buttons stay reachable
 * beside it.
 */
/** The one tab in the page's Tab sequence: the active one, else the first. */
const focusableTabId = computed(() =>
    props.tabs.some((tab) => tab.id === props.activeId) ? props.activeId : props.tabs[0]?.id
);

const ownedTabIds = computed(() => props.tabs.map((_, index) => tabElementId(index)).join(' '));

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
    <div
        class="alp-workbench-tab-strip"
        :class="{ 'alp-workbench-tab-strip--dragging': draggingId }"
        @dragover.prevent
        @drop="onDropStrip"
    >
        <div
            role="tablist"
            class="alp-workbench-tab-list"
            aria-orientation="horizontal"
            :aria-label="label"
            :aria-owns="ownedTabIds || undefined"
        />
        <div class="alp-workbench-tab-scroller">
            <div
                v-for="(tab, index) in tabs"
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
                <button
                    :id="tabElementId(index)"
                    type="button"
                    role="tab"
                    class="alp-workbench-tab"
                    data-testid="workbench-tab"
                    :aria-selected="tab.id === activeId"
                    :aria-controls="panelId"
                    :tabindex="tab.id === focusableTabId ? 0 : -1"
                    :draggable="draggable"
                    @click="$emit('select', tab.id)"
                    @keydown="onTabKeydown(tab.id, $event)"
                    @dblclick="$emit('pin', tab.id)"
                    @dragstart="onDragStart(tab.id, $event)"
                    @dragend="onDragEnd"
                >
                    <i v-if="tab.icon" :class="tab.icon" aria-hidden="true" />
                    <span class="alp-workbench-tab-label">{{ tab.label }}</span>
                    <span v-if="tab.dirty" class="alp-workbench-tab-dirty" aria-label="Unsaved changes" />
                </button>
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
        </div>
    </div>
</template>
