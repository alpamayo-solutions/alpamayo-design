<template>
    <ConfirmDialog
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
    >
        <template #container="{ message, acceptCallback, rejectCallback }">
            <div class="flex items-center justify-between shrink-0 p-5">
                <span class="font-semibold text-xl text-surface-800 dark:text-surface-0">{{
                    message.header
                }}</span>
                <SecondaryButton variant="text" rounded @click="rejectCallback" autofocus>
                    <template #icon>
                        <TimesIcon />
                    </template>
                </SecondaryButton>
            </div>
            <div
                class="overflow-y-auto pt-0 px-5 pb-5 flex items-center gap-4 text-surface-700 dark:text-surface-0/80"
            >
                <ExclamationTriangeIcon class="size-6" />
                {{ message.message }}
            </div>
            <div class="pt-0 px-5 pb-5 flex justify-end gap-2">
                <SecondaryButton
                    @click="rejectCallback"
                    :label="message.rejectProps?.label || message.rejectLabel || 'Cancel'"
                    size="small"
                />
                <Button
                    @click="acceptCallback"
                    :label="message.acceptProps?.label || message.acceptLabel || 'OK'"
                    :severity="
                        message.acceptProps?.severity ||
                        (String(message.acceptClass || '').includes('danger') ? 'danger' : null)
                    "
                    :icon="
                        message.acceptProps?.icon ||
                        (String(message.acceptClass || '').includes('danger') ? 'pi pi-trash' : undefined)
                    "
                    size="small"
                />
            </div>
        </template>
    </ConfirmDialog>
</template>

<script setup lang="ts">
import ExclamationTriangeIcon from '@primevue/icons/exclamationtriangle';
import TimesIcon from '@primevue/icons/times';
import ConfirmDialog, {
    type ConfirmDialogPassThroughOptions,
    type ConfirmDialogProps
} from 'primevue/confirmdialog';
import { ref } from 'vue';
import Button from './Button.vue';
import SecondaryButton from './SecondaryButton.vue';
import { ptViewMerge } from './utils';
import auraConfirmDialodPreset from '../../presets/alpamayo/confirmdialog/index.js';

interface Props extends /* @vue-ignore */ ConfirmDialogProps {}
defineProps<Props>();

const theme = ref<ConfirmDialogPassThroughOptions>(auraConfirmDialodPreset);
</script>
