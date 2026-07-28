<script setup lang="ts">
import type { WorkbenchTab } from './TabStrip.vue';

export type EditorDropEdge = 'left' | 'right' | 'top' | 'bottom';
export type EditorSplitDirection = 'horizontal' | 'vertical';

withDefaults(
    defineProps<{
        groupId: string;
        tabs: WorkbenchTab[];
        activeId?: string;
        label?: string;
        focused?: boolean;
        draggable?: boolean;
        dragActive?: boolean;
        showSplitActions?: boolean;
        showCloseAction?: boolean;
    }>(),
    {
        activeId: undefined,
        label: 'Editor group',
        focused: false,
        draggable: false,
        dragActive: false,
        showSplitActions: true,
        showCloseAction: false
    }
);

const emit = defineEmits<{
    focus: [groupId: string];
    select: [tabId: string];
    pin: [tabId: string];
    close: [tabId: string];
    'close-group': [];
    split: [direction: EditorSplitDirection];
    'drag-start': [tabId: string, event: DragEvent];
    'drop-tab': [beforeTabId: string | undefined, event: DragEvent];
    'drag-end': [event: DragEvent];
    'edge-drop': [edge: EditorDropEdge, event: DragEvent];
}>();

function onDropContent(event: DragEvent) {
    event.preventDefault();
    emit('drop-tab', undefined, event);
}

function onEdgeDrop(edge: EditorDropEdge, event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    emit('edge-drop', edge, event);
}
</script>

<template>
    <section
        class="alp-workbench-editor-group"
        :class="{ 'alp-workbench-editor-group--focused': focused }"
        :aria-label="label"
        :data-group-id="groupId"
        role="region"
        @pointerdown="$emit('focus', groupId)"
    >
        <header class="alp-workbench-editor-group-header">
            <AlpWorkbenchTabStrip
                :tabs="tabs"
                :active-id="activeId"
                :draggable="draggable"
                @select="$emit('select', $event)"
                @pin="$emit('pin', $event)"
                @close="$emit('close', $event)"
                @drag-start="(tabId, event) => $emit('drag-start', tabId, event)"
                @drop-tab="(beforeTabId, event) => $emit('drop-tab', beforeTabId, event)"
                @drag-end="$emit('drag-end', $event)"
            />
            <div v-if="showSplitActions || showCloseAction" class="alp-workbench-editor-group-actions">
                <AlpWorkbenchIconButton
                    v-if="showSplitActions"
                    label="Split editor right"
                    @click="$emit('split', 'horizontal')"
                >
                    <span class="material-symbols-outlined" aria-hidden="true">splitscreen_vertical_add</span>
                </AlpWorkbenchIconButton>
                <AlpWorkbenchIconButton
                    v-if="showSplitActions"
                    label="Split editor down"
                    @click="$emit('split', 'vertical')"
                >
                    <span class="material-symbols-outlined" aria-hidden="true">splitscreen_add</span>
                </AlpWorkbenchIconButton>
                <AlpWorkbenchIconButton
                    v-if="showCloseAction"
                    label="Close editor group"
                    icon="pi pi-times"
                    @click="$emit('close-group')"
                />
            </div>
        </header>

        <div
            class="alp-workbench-editor-group-content"
            data-testid="editor-group-content"
            @dragover.prevent
            @drop="onDropContent"
        >
            <slot />

            <template v-if="dragActive">
                <div
                    v-for="edge in ['left', 'right', 'top', 'bottom'] as const"
                    :key="edge"
                    class="alp-workbench-editor-group-edge-drop"
                    :class="`alp-workbench-editor-group-edge-drop--${edge}`"
                    :data-edge="edge"
                    aria-hidden="true"
                    @dragover.prevent.stop
                    @drop="onEdgeDrop(edge, $event)"
                />
            </template>
        </div>
    </section>
</template>
