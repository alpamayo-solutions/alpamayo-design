<script setup lang="ts">
import { computed, ref } from 'vue';
import { isAlpIcon } from '../../../composables/alpIcons';
import menuPreset from '../../../presets/alpamayo/menu/index.js';
import WorkbenchIcon from './Icon.vue';

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

// PrimeVue's own item icon is a class on a span, so only a menu holding `alp_*` icons takes the slot.
const itemIconClass = (menuPreset.itemIcon as { class: string | string[] }).class;
const hasAlpIcon = computed(() => props.items.some((item) => isAlpIcon(item.icon)));
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
    <VoltMenu ref="menu" :model="model" popup class="alp-workbench-context-menu">
        <template v-if="hasAlpIcon" #itemicon="{ item }">
            <span v-if="item.icon" data-pc-section="itemicon" :class="itemIconClass">
                <WorkbenchIcon :icon="item.icon" />
            </span>
        </template>
    </VoltMenu>
</template>
