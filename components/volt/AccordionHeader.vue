<template>
    <AccordionHeader
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <slot></slot>
    </AccordionHeader>
</template>

<script setup lang="ts">
import AccordionHeader, {
    type AccordionHeaderPassThroughOptions,
    type AccordionHeaderProps
} from 'primevue/accordionheader';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraAccordionHeaderPreset from '../../presets/alpamayo/accordionheader/index.js';

interface Props extends /* @vue-ignore */ AccordionHeaderProps {}
defineProps<Props>();

const theme = ref<AccordionHeaderPassThroughOptions>(auraAccordionHeaderPreset);
</script>
