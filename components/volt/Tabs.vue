<template>
    <Tabs
        :value="props.value"
        unstyled
        @update:value="$emit('update:value', $event)"
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <slot></slot>
    </Tabs>
</template>

<script setup lang="ts">
import Tabs, { type TabsPassThroughOptions, type TabsProps } from 'primevue/tabs';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraTabsPreset from '../../presets/alpamayo/tabs/index.js';

interface Props extends /* @vue-ignore */ TabsProps {}
const props = defineProps<Props>();
const emit = defineEmits<{ (e: 'update:value', value: string | number): void }>();

const theme = ref<TabsPassThroughOptions>(auraTabsPreset);
</script>
