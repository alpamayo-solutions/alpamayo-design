<script setup lang="ts">
export type WorkbenchPanelMode = 'terminal' | 'chat';

defineProps<{
    open: boolean;
    mode: WorkbenchPanelMode;
}>();

defineEmits<{
    activate: [mode: WorkbenchPanelMode];
    toggle: [];
}>();
</script>

<template>
    <section class="alp-workbench-bottom-panel" :class="{ 'alp-workbench-bottom-panel--open': open }">
        <header class="alp-workbench-bottom-panel-header">
            <div class="alp-workbench-bottom-panel-modes">
                <VoltButton
                    text
                    label="Terminal"
                    aria-label="Open Terminal"
                    :class="{ 'alp-workbench-bottom-panel-mode--active': mode === 'terminal' }"
                    @click="$emit('activate', 'terminal')"
                />
                <VoltButton
                    text
                    label="Chat"
                    aria-label="Open Chat"
                    :class="{ 'alp-workbench-bottom-panel-mode--active': mode === 'chat' }"
                    @click="$emit('activate', 'chat')"
                />
            </div>
            <AlpWorkbenchIconButton
                :label="open ? 'Collapse bottom panel' : 'Expand bottom panel'"
                :icon="open ? 'pi pi-chevron-down' : 'pi pi-chevron-up'"
                @click="$emit('toggle')"
            />
        </header>
        <div class="alp-workbench-bottom-panel-content" data-testid="workbench-panel-content">
            <div class="alp-workbench-bottom-panel-content-inner">
                <slot :name="mode" />
            </div>
        </div>
    </section>
</template>
