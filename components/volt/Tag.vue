<template>
    <Tag
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </Tag>
</template>

<script setup lang="ts">
import Tag, { type TagPassThroughOptions, type TagProps } from 'primevue/tag';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraTagPreset from '../../presets/alpamayo/tag/index.js';

interface Props extends /* @vue-ignore */ TagProps {}
defineProps<Props>();

const theme = ref<TagPassThroughOptions>(auraTagPreset);
</script>
