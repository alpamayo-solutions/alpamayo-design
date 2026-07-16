<template>
    <Badge
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </Badge>
</template>

<script setup lang="ts">
import Badge, { type BadgePassThroughOptions, type BadgeProps } from 'primevue/badge';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraBadgePreset from '../../presets/alpamayo/badge/index.js';

interface Props extends /* @vue-ignore */ BadgeProps {}
defineProps<Props>();

const theme = ref<BadgePassThroughOptions>(auraBadgePreset);
</script>
