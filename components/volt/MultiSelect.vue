<template>
    <MultiSelect
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template #dropdownicon>
            <ChevronDownIcon />
        </template>
        <template #loadingicon>
            <SpinnerIcon class="animate-spin" />
        </template>
        <template #filtericon>
            <SearchIcon class="text-surface-400" />
        </template>
        <template #clearicon>
            <TimesIcon class="text-surface-400 absolute top-1/2 -mt-2 end-10" />
        </template>
        <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </MultiSelect>
</template>

<script setup lang="ts">
import ChevronDownIcon from '@primevue/icons/chevrondown';
import SearchIcon from '@primevue/icons/search';
import SpinnerIcon from '@primevue/icons/spinner';
import TimesIcon from '@primevue/icons/times';
import MultiSelect, { type MultiSelectPassThroughOptions, type MultiSelectProps } from 'primevue/multiselect';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraMultiSelectPreset from '../../presets/alpamayo/multiselect/index.js';

interface Props extends /* @vue-ignore */ MultiSelectProps {}
defineProps<Props>();

const theme = ref<MultiSelectPassThroughOptions>(auraMultiSelectPreset);
</script>
