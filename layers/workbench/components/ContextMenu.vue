<script setup lang="ts">
import { computed, ref } from 'vue';

export interface WorkbenchMenuItem {
    id: string;
    label: string;
    icon?: string;
    destructive?: boolean;
    disabled?: boolean;
}

const props = defineProps<{
    items: WorkbenchMenuItem[];
}>();

const emit = defineEmits<{
    select: [item: WorkbenchMenuItem];
}>();

const menu = ref<{ toggle: (event: Event) => void }>();
const model = computed(() =>
    props.items.map((item) => ({
        ...item,
        class: item.destructive ? 'alp-workbench-context-menu-item--destructive' : undefined,
        command: () => emit('select', item)
    }))
);

defineExpose({
    toggle: (event: Event) => menu.value?.toggle(event)
});
</script>

<template>
    <VoltMenu ref="menu" :model="model" popup class="alp-workbench-context-menu" />
</template>
