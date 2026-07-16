<template>
    <InputText
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    />
</template>

<script setup lang="ts">
import InputText, { type InputTextPassThroughOptions, type InputTextProps } from 'primevue/inputtext';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraInputTextPreset from '../../presets/alpamayo/inputtext/index.js';

interface Props extends /* @vue-ignore */ InputTextProps {}
defineProps<Props>();

const theme = ref<InputTextPassThroughOptions>(auraInputTextPreset);
</script>
