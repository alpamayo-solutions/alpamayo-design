<template>
    <Checkbox
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    />
</template>

<script setup lang="ts">
import Checkbox, { type CheckboxPassThroughOptions, type CheckboxProps } from 'primevue/checkbox';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraCheckboxPreset from '../../presets/alpamayo/checkbox/index.js';

interface Props extends /* @vue-ignore */ CheckboxProps {}
defineProps<Props>();

const theme = ref<CheckboxPassThroughOptions>(auraCheckboxPreset);
</script>
