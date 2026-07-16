<template>
    <Toast
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template #closeicon>
            <TimesIcon />
        </template>
        <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </Toast>
</template>

<script setup lang="ts">
import TimesIcon from '@primevue/icons/times';
import Toast, { type ToastPassThroughOptions, type ToastProps } from 'primevue/toast';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraToastPreset from '../../presets/alpamayo/toast/index.js';

interface Props extends /* @vue-ignore */ ToastProps {}
defineProps<Props>();

const theme = ref<ToastPassThroughOptions>(auraToastPreset);
</script>
