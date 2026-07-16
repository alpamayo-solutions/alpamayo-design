<template>
    <ToggleSwitch
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </ToggleSwitch>
</template>

<script setup lang="ts">
import ToggleSwitch, {
    type ToggleSwitchPassThroughOptions,
    type ToggleSwitchProps
} from 'primevue/toggleswitch';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraToggleSwitchPreset from '../../presets/alpamayo/toggleswitch/index.js';

interface Props extends /* @vue-ignore */ ToggleSwitchProps {}
defineProps<Props>();

const theme = ref<ToggleSwitchPassThroughOptions>(auraToggleSwitchPreset);
</script>
