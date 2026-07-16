<template>
    <TabPanels
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <slot></slot>
    </TabPanels>
</template>

<script setup lang="ts">
import TabPanels, { type TabPanelsPassThroughOptions, type TabPanelsProps } from 'primevue/tabpanels';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraTabPanelsPreset from '../../presets/alpamayo/tabpanels/index.js';

interface Props extends /* @vue-ignore */ TabPanelsProps {}
defineProps<Props>();

const theme = ref<TabPanelsPassThroughOptions>(auraTabPanelsPreset);
</script>
