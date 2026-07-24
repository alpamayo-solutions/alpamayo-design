<script setup lang="ts">
export interface WorkbenchTab {
    id: string;
    label: string;
    icon?: string;
    preview?: boolean;
    dirty?: boolean;
}

defineProps<{
    activeId?: string;
    tabs: WorkbenchTab[];
}>();

defineEmits<{
    select: [id: string];
    close: [id: string];
}>();
</script>

<template>
    <VoltTabs :value="activeId ?? ''" class="alp-workbench-tab-strip">
        <VoltTabList>
            <VoltTab
                v-for="tab in tabs"
                :key="tab.id"
                :value="tab.id"
                class="alp-workbench-tab"
                :class="{
                    'alp-workbench-tab--active': tab.id === activeId,
                    'alp-workbench-tab--preview': tab.preview
                }"
                data-testid="workbench-tab"
                @click="$emit('select', tab.id)"
            >
                <i v-if="tab.icon" :class="tab.icon" aria-hidden="true" />
                <span class="alp-workbench-tab-label">{{ tab.label }}</span>
                <span v-if="tab.dirty" class="alp-workbench-tab-dirty" aria-label="Unsaved changes" />
                <span
                    v-else
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
