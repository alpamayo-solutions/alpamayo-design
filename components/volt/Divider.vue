<template>
    <Divider
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </Divider>
</template>

<script setup lang="ts">
import Divider, { type DividerPassThroughOptions, type DividerProps } from 'primevue/divider';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraDividerPreset from '../../presets/alpamayo/divider/index.js';

interface Props extends /* @vue-ignore */ DividerProps {}
defineProps<Props>();

const theme = ref<DividerPassThroughOptions>(auraDividerPreset);
</script>
