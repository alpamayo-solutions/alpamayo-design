<template>
    <TabList
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <slot></slot>
    </TabList>
</template>

<script setup lang="ts">
import TabList, { type TabListPassThroughOptions, type TabListProps } from 'primevue/tablist';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraTabListPreset from '../../presets/alpamayo/tablist/index.js';

interface Props extends /* @vue-ignore */ TabListProps {}
defineProps<Props>();

const theme = ref<TabListPassThroughOptions>(auraTabListPreset);
</script>
