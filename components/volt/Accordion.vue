<template>
    <Accordion
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <slot></slot>
    </Accordion>
</template>

<script setup lang="ts">
import Accordion, { type AccordionPassThroughOptions, type AccordionProps } from 'primevue/accordion';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraAccordionPreset from '../../presets/alpamayo/accordion/index.js';

interface Props extends /* @vue-ignore */ AccordionProps {}
defineProps<Props>();

const theme = ref<AccordionPassThroughOptions>(auraAccordionPreset);
</script>
