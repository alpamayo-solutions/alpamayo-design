<template>
    <ProgressBar
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </ProgressBar>
</template>

<script setup lang="ts">
import ProgressBar, { type ProgressBarPassThroughOptions, type ProgressBarProps } from 'primevue/progressbar';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraProgressBarPreset from '../../presets/alpamayo/progressbar/index.js';

interface Props extends /* @vue-ignore */ ProgressBarProps {}
defineProps<Props>();

const theme = ref<ProgressBarPassThroughOptions>(auraProgressBarPreset);
</script>

<style>
@keyframes p-progressbar-indeterminate-anim {
    0% {
        inset-inline-start: -35%;
        inset-inline-end: 100%;
    }
    60% {
        inset-inline-start: 100%;
        inset-inline-end: -90%;
    }
    100% {
        inset-inline-start: 100%;
        inset-inline-end: -90%;
    }
}

@keyframes p-progressbar-indeterminate-anim-short {
    0% {
        inset-inline-start: -200%;
        inset-inline-end: 100%;
    }
    60% {
        inset-inline-start: 107%;
        inset-inline-end: -8%;
    }
    100% {
        inset-inline-start: 107%;
        inset-inline-end: -8%;
    }
}
</style>
