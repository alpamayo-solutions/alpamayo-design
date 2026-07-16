<template>
    <AccordionContent
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <slot></slot>
    </AccordionContent>
</template>

<script setup lang="ts">
import AccordionContent, {
    type AccordionContentPassThroughOptions,
    type AccordionContentProps
} from 'primevue/accordioncontent';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraAccordionContentPreset from '../../presets/alpamayo/accordioncontent/index.js';

interface Props extends /* @vue-ignore */ AccordionContentProps {}
defineProps<Props>();

const theme = ref<AccordionContentPassThroughOptions>(auraAccordionContentPreset);
</script>
