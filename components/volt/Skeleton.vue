<template>
    <Skeleton
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    />
</template>

<script setup lang="ts">
import Skeleton, { type SkeletonPassThroughOptions, type SkeletonProps } from 'primevue/skeleton';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import skeletonPreset from '../../presets/alpamayo/skeleton/index.js';

interface Props extends /* @vue-ignore */ SkeletonProps {}
defineProps<Props>();

const theme = ref<SkeletonPassThroughOptions>(skeletonPreset);
</script>
