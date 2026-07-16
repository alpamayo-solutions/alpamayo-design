<template>
    <RadioButton
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    />
</template>

<script setup lang="ts">
import RadioButton, { type RadioButtonPassThroughOptions, type RadioButtonProps } from 'primevue/radiobutton';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraRadioButtonPreset from '../../presets/alpamayo/radiobutton/index.js';

interface Props extends /* @vue-ignore */ RadioButtonProps {}
defineProps<Props>();

const theme = ref<RadioButtonPassThroughOptions>(auraRadioButtonPreset);
</script>
