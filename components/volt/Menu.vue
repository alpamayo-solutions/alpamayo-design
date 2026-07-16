<template>
    <Menu
        ref="el"
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </Menu>
</template>

<script setup lang="ts">
import Menu, { type MenuPassThroughOptions, type MenuProps } from 'primevue/menu';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraMenuPreset from '../../presets/alpamayo/menu/index.js';

interface Props extends /* @vue-ignore */ MenuProps {}
defineProps<Props>();

const theme = ref<MenuPassThroughOptions>(auraMenuPreset);

const el = ref<any>();
defineExpose({
    toggle: (event: Event) => el.value?.toggle(event)
});
</script>
