<template>
    <Password
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template #maskicon="{ toggleCallback }">
            <EyeSlashIcon
                @click="toggleCallback"
                class="end-3 text-surface-500 dark:text-surface-400 absolute top-1/2 -mt-2 w-4 h-4"
            />
        </template>
        <template #unmaskicon="{ toggleCallback }">
            <EyeIcon
                @click="toggleCallback"
                class="end-3 text-surface-500 dark:text-surface-400 absolute top-1/2 -mt-2 w-4 h-4"
            />
        </template>
        <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </Password>
</template>

<script setup lang="ts">
import EyeIcon from '@primevue/icons/eye';
import EyeSlashIcon from '@primevue/icons/eyeslash';
import Password, { type PasswordPassThroughOptions, type PasswordProps } from 'primevue/password';
import { ref } from 'vue';
import { ptViewMerge } from './utils';
import auraPasswordPreset from '../../presets/alpamayo/password/index.js';

interface Props extends /* @vue-ignore */ PasswordProps {}
defineProps<Props>();

const theme = ref<PasswordPassThroughOptions>(auraPasswordPreset);
</script>
