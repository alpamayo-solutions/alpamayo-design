<template>
    <MegaMenu
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
    </MegaMenu>
</template>

<script setup lang="ts">
import MegaMenu, { type MegaMenuPassThroughOptions, type MegaMenuProps } from 'primevue/megamenu';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import megaMenuPreset from '../../presets/alpamayo/megamenu/index.js';

interface Props extends /* @vue-ignore */ MegaMenuProps {}
defineProps<Props>();

const theme = ref<MegaMenuPassThroughOptions>(megaMenuPreset);

const el = ref();
defineExpose({
    toggle: (event?: Event) => el.value.toggle(event)
});
</script>
