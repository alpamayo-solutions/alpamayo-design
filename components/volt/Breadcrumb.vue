<template>
    <Breadcrumb
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </Breadcrumb>
</template>

<script setup lang="ts">
import Breadcrumb, { type BreadcrumbPassThroughOptions, type BreadcrumbProps } from 'primevue/breadcrumb';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraBreadcrumbPreset from '../../presets/alpamayo/breadcrumb/index.js';

interface Props extends /* @vue-ignore */ BreadcrumbProps {}
defineProps<Props>();

const theme = ref<BreadcrumbPassThroughOptions>(auraBreadcrumbPreset);
</script>
