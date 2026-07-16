<template>
    <Message
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template #closeicon>
            <TimesIcon />
        </template>
        <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </Message>
</template>

<script setup lang="ts">
import TimesIcon from '@primevue/icons/times';
import Message, { type MessagePassThroughOptions, type MessageProps } from 'primevue/message';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraMessagePreset from '../../presets/alpamayo/message/index.js';

interface Props extends /* @vue-ignore */ MessageProps {}
defineProps<Props>();

const theme = ref<MessagePassThroughOptions>(auraMessagePreset);
</script>
