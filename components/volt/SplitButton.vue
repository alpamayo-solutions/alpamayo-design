<template>
    <SplitButton
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </SplitButton>
</template>

<script setup lang="ts">
import SplitButton, { type SplitButtonPassThroughOptions, type SplitButtonProps } from 'primevue/splitbutton';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import splitButtonPreset from '../../presets/alpamayo/splitbutton/index.js';

interface Props extends /* @vue-ignore */ SplitButtonProps {}
defineProps<Props>();

const theme = ref<SplitButtonPassThroughOptions>(splitButtonPreset);
</script>
