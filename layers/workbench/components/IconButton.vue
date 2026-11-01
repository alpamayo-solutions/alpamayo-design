<script setup lang="ts">
import { isAlpIcon } from '../../../composables/alpIcons';
import WorkbenchIcon from './Icon.vue';

withDefaults(
    defineProps<{
        label: string;
        icon?: string;
        active?: boolean;
        disabled?: boolean;
    }>(),
    {
        icon: undefined,
        active: false,
        disabled: false
    }
);

defineEmits<{
    click: [event: MouseEvent];
}>();
</script>

<template>
    <VoltButton
        text
        rounded
        :icon="isAlpIcon(icon) ? undefined : icon"
        :disabled="disabled"
        :aria-label="label"
        :title="label"
        class="alp-workbench-icon-button"
        :class="{ 'alp-workbench-icon-button--active': active }"
        @click="$emit('click', $event)"
    >
        <WorkbenchIcon v-if="isAlpIcon(icon)" :icon="icon" />
        <slot />
    </VoltButton>
</template>
