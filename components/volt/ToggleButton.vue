<template>
    <ToggleButton
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </ToggleButton>
</template>

<script setup lang="ts">
import ToggleButton, {
    type ToggleButtonPassThroughOptions,
    type ToggleButtonProps
} from 'primevue/togglebutton';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraToggleButtonPreset from '../../presets/alpamayo/togglebutton/index.js';

interface Props extends /* @vue-ignore */ ToggleButtonProps {}
defineProps<Props>();

const theme = ref<ToggleButtonPassThroughOptions>(auraToggleButtonPreset);
</script>
