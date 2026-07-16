<template>
    <Chip
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template #removeicon="{ removeCallback, keydownCallback }">
            <TimesCircleIcon
                class="cursor-pointer text-base w-4 h-4 rounded-full text-surface-800 dark:text-surface-0 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-primary"
                @click="removeCallback"
                @keydown="keydownCallback"
            />
        </template>
        <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </Chip>
</template>

<script setup lang="ts">
import TimesCircleIcon from '@primevue/icons/timescircle';
import Chip, { type ChipPassThroughOptions, type ChipProps } from 'primevue/chip';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraChipPreset from '../../presets/alpamayo/chip/index.js';

interface Props extends /* @vue-ignore */ ChipProps {}
defineProps<Props>();

const theme = ref<ChipPassThroughOptions>(auraChipPreset);
</script>
