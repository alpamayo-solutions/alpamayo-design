<script setup lang="ts">
export interface WorkbenchActivityItem {
    id: string;
    label: string;
    icon?: string;
    logomark?: boolean;
}

defineProps<{
    activeId?: string;
    items: WorkbenchActivityItem[];
}>();

defineEmits<{
    select: [id: string];
}>();
</script>

<template>
    <aside class="alp-workbench-activity-rail" aria-label="Applications">
        <VoltButton
            v-for="item in items"
            :key="item.id"
            text
            rounded
            :aria-label="item.label"
            :title="item.label"
            class="alp-workbench-activity-item"
            :class="{ 'alp-workbench-activity-item--active': item.id === activeId }"
            @click="$emit('select', item.id)"
        >
            <span v-if="item.logomark" class="alp-workbench-activity-logomark" aria-hidden="true" />
            <i v-else-if="item.icon" :class="item.icon" aria-hidden="true" />
        </VoltButton>
        <div class="alp-workbench-activity-footer">
            <slot name="footer" />
        </div>
    </aside>
</template>
