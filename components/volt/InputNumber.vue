<template>
    <InputNumber
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
        :locale="locale"
    >
        <template #incrementicon>
            <AngleUpIcon />
        </template>
        <template #decrementicon>
            <AngleDownIcon />
        </template>
        <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </InputNumber>
</template>

<script setup lang="ts">
import AngleDownIcon from '@primevue/icons/angledown';
import AngleUpIcon from '@primevue/icons/angleup';
import InputNumber, { type InputNumberPassThroughOptions, type InputNumberProps } from 'primevue/inputnumber';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraInputNumberPreset from '../../presets/alpamayo/inputnumber/index.js';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

interface Props extends /* @vue-ignore */ InputNumberProps {}
defineProps<Props>();

const theme = ref<InputNumberPassThroughOptions>(auraInputNumberPreset);
</script>
