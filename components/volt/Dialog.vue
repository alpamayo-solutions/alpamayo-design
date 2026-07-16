<template>
    <Dialog
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template #closebutton="{ closeCallback }">
            <SecondaryButton rounded @click="closeCallback">
                <template #icon>
                    <TimesIcon />
                </template>
            </SecondaryButton>
        </template>
        <template #maximizebutton="{ maximized, maximizeCallback }">
            <SecondaryButton rounded @click="maximizeCallback" autofocus>
                <template #icon>
                    <WindowMinimizeIcon v-if="maximized" />
                    <WindowMaximizeIcon v-else />
                </template>
            </SecondaryButton>
        </template>
        <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
    </Dialog>
</template>

<script setup lang="ts">
import TimesIcon from '@primevue/icons/times';
import WindowMaximizeIcon from '@primevue/icons/windowmaximize';
import WindowMinimizeIcon from '@primevue/icons/windowminimize';
import Dialog, { type DialogPassThroughOptions, type DialogProps } from 'primevue/dialog';
import { ref } from 'vue';
import SecondaryButton from './SecondaryButton.vue';
import { ptViewMerge } from './utils';
import auraDialogPreset from '../../presets/alpamayo/dialog/index.js';

interface Props extends /* @vue-ignore */ DialogProps {}
defineProps<Props>();

const theme = ref<DialogPassThroughOptions>(auraDialogPreset);
</script>
