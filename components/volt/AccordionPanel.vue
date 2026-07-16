<template>
    <AccordionPanel
        :value="props.value"
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <slot></slot>
    </AccordionPanel>
</template>

<script setup lang="ts">
import AccordionPanel, {
    type AccordionPanelPassThroughOptions,
    type AccordionPanelProps
} from 'primevue/accordionpanel';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraAccordionPanelPreset from '../../presets/alpamayo/accordionpanel/index.js';

interface Props extends /* @vue-ignore */ AccordionPanelProps {}
const props = defineProps<Props>();

const theme = ref<AccordionPanelPassThroughOptions>(auraAccordionPanelPreset);
</script>
