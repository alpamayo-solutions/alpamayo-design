<template>
    <Checkbox
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template #icon="{ checked, indeterminate }">
            <CheckIcon v-if="checked" :class="theme.icon" />
            <MinusIcon v-else-if="indeterminate" :class="theme.icon" />
        </template>
    </Checkbox>
</template>

<script setup lang="ts">
import CheckIcon from '@primevue/icons/check';
import MinusIcon from '@primevue/icons/minus';
import Checkbox, { type CheckboxPassThroughOptions, type CheckboxProps } from 'primevue/checkbox';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraCheckboxPreset from '../../presets/alpamayo/checkbox/index.js';

interface Props extends /* @vue-ignore */ CheckboxProps {}
defineProps<Props>();

const theme = ref<CheckboxPassThroughOptions>(auraCheckboxPreset);
</script>
