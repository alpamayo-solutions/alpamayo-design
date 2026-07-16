<template>
    <Textarea
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    />
</template>

<script setup lang="ts">
import Textarea, { type TextareaPassThroughOptions, type TextareaProps } from 'primevue/textarea';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraTextAreaPreset from '../../presets/alpamayo/textarea/index.js';

interface Props extends /* @vue-ignore */ TextareaProps {}
defineProps<Props>();

const theme = ref<TextareaPassThroughOptions>(auraTextAreaPreset);
</script>
