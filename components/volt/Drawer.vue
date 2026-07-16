<template>
    <Drawer
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template #closebutton="{ closeCallback }">
            <SecondaryButton variant="text" rounded-sm @click="closeCallback" autofocus>
                <template #icon>
                    <TimesIcon />
                </template>
            </SecondaryButton>
        </template>
        <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </Drawer>
</template>

<script setup lang="ts">
import TimesIcon from '@primevue/icons/times';
import Drawer, { type DrawerPassThroughOptions, type DrawerProps } from 'primevue/drawer';
import { ref } from 'vue';
import SecondaryButton from './SecondaryButton.vue';
import { ptViewMerge } from './utils';
import auraDrawerPreset from '../../presets/alpamayo/drawer/index.js';

interface Props extends /* @vue-ignore */ DrawerProps {}
defineProps<Props>();

const theme = ref<DrawerPassThroughOptions>(auraDrawerPreset);
</script>
