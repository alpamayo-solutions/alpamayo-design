<template>
    <Menu
        ref="el"
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
        @hide="returnFocus"
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
// A popup menu closed with Tab leaves focus on the page start (the menu sits at the end of <body>):
// hand it back to the button that opened it. Escape and item clicks already move focus themselves.
let opener: HTMLElement | null = null;
function returnFocus() {
    const target = opener;
    setTimeout(() => {
        if (
            target?.isConnected &&
            (document.activeElement === document.body || document.activeElement === null)
        )
            target.focus();
    });
}
defineExpose({
    toggle: (event: Event) => {
        opener = event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
        el.value?.toggle(event);
    }
});
</script>
