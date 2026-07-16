<template>
    <AutoComplete
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </AutoComplete>
</template>

<script setup lang="ts">
import AutoComplete, {
    type AutoCompletePassThroughOptions,
    type AutoCompleteProps
} from 'primevue/autocomplete';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import autoCompletePreset from '../../presets/alpamayo/autocomplete/index.js';

interface Props extends /* @vue-ignore */ AutoCompleteProps {}
defineProps<Props>();

const theme = ref<AutoCompletePassThroughOptions>(autoCompletePreset);
</script>
