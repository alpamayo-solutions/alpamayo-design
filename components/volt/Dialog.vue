<template>
    <Dialog
        unstyled
        :pt="theme"
        :ptOptions="{
            mergeProps: ptViewMerge
        }"
        @show="focusInside"
    >
        <template #closebutton="{ closeCallback }">
            <SecondaryButton ref="closeButton" rounded :aria-label="closeLabel" @click="closeCallback">
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
import { usePrimeVue } from 'primevue/config';
import { computed, nextTick, ref } from 'vue';
import SecondaryButton from './SecondaryButton.vue';
import { ptViewMerge } from './utils';
import auraDialogPreset from '../../presets/alpamayo/dialog/index.js';

interface Props extends /* @vue-ignore */ DialogProps {}
defineProps<Props>();

const theme = ref<DialogPassThroughOptions>(auraDialogPreset);

// The close button replaces PrimeVue's own, which named itself from the
// locale's `aria.close`; an icon-only button without it has no accessible
// name (axe: button-name). Same source, same fallback as PrimeVue.
const primevue = usePrimeVue();
const closeLabel = computed(() => primevue.config.locale?.aria?.close || 'Close');

// PrimeVue moves focus into the dialog through its own close button, which the slot above
// replaces; without this, focus stays on the page behind the modal.
const closeButton = ref<{ $el?: HTMLElement } | null>(null);
async function focusInside() {
    await nextTick();
    const button = closeButton.value?.$el;
    const dialog = button?.closest('[role="dialog"], [role="alertdialog"]');
    if (button && dialog && !dialog.contains(document.activeElement)) button.focus();
}
</script>
