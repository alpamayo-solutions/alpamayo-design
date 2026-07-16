<template>
    <InputMask
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    />
</template>

<script setup lang="ts">
import InputMask, { type InputMaskPassThroughOptions, type InputMaskProps } from 'primevue/inputmask';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraInputMaskPreset from '../../presets/alpamayo/inputmask/index.js';

interface Props extends /* @vue-ignore */ InputMaskProps {}
defineProps<Props>();

const theme = ref<InputMaskPassThroughOptions>(auraInputMaskPreset);
</script>
