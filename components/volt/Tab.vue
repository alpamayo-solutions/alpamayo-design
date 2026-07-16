<template>
    <Tab
        :value="props.value"
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <slot></slot>
    </Tab>
</template>

<script setup lang="ts">
import Tab, { type TabPassThroughOptions, type TabProps } from 'primevue/tab';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraTabPreset from '../../presets/alpamayo/tab/index.js';

interface Props extends /* @vue-ignore */ TabProps {}
const props = defineProps<Props>();

const theme = ref<TabPassThroughOptions>(auraTabPreset);
</script>
