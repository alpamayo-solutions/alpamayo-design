<template>
    <Avatar
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </Avatar>
</template>

<script setup lang="ts">
import Avatar, { type AvatarPassThroughOptions, type AvatarProps } from 'primevue/avatar';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraAvatarPreset from '../../presets/alpamayo/avatar/index.js';

interface Props extends /* @vue-ignore */ AvatarProps {}
defineProps<Props>();

const theme = ref<AvatarPassThroughOptions>(auraAvatarPreset);
</script>
